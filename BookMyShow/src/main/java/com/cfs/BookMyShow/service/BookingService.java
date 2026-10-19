package com.cfs.BookMyShow.service;

import com.cfs.BookMyShow.dto.BookingResponse;
import com.cfs.BookMyShow.dto.CreateBookingRequest;
import com.cfs.BookMyShow.entity.Booking;
import com.cfs.BookMyShow.entity.BookingStatus;
import com.cfs.BookMyShow.entity.Show;
import com.cfs.BookMyShow.entity.ShowSeat;
import com.cfs.BookMyShow.repository.BookingRepo;
import com.cfs.BookMyShow.repository.CustomerRepo;
import com.cfs.BookMyShow.repository.ShowRepo;
import com.cfs.BookMyShow.repository.ShowSeatRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

@Service
public class BookingService {
    private final ShowRepo showRepo;
    private final ShowSeatRepo showSeatRepo;
    private final BookingRepo bookingRepo;
    private final CustomerRepo customerRepo;

    public BookingService(ShowRepo showRepo, ShowSeatRepo showSeatRepo, BookingRepo bookingRepo, CustomerRepo customerRepo) {
        this.showRepo = showRepo;
        this.showSeatRepo = showSeatRepo;
        this.bookingRepo = bookingRepo;
        this.customerRepo = customerRepo;
    }
    @Transactional
    public BookingResponse book(Long showId, CreateBookingRequest request){
        Show show=showRepo.findById(showId).orElseThrow(()->new ResourceNotFound("Show Not Found"));
        var customer=customerRepo.findById(request.profileId())
                .orElseThrow(()->new ResourceNotFound("profile not found"));
        List<String> labels=request.seatLabels().stream().map(label->label.trim().toUpperCase(Locale.ROOT)).toList();
        if(labels.stream().distinct().count()!=labels.size()){
            throw new SeatUnavaliable("Seat Not available");
        }
        List<ShowSeat> seats=showSeatRepo.findForUpdate(showId,labels);
        if(seats.size()!=labels.size() || seats.stream().anyMatch(ShowSeat::isReserved)){
            throw new SeatUnavaliable("One or More seats are unavailable");
        }
        seats.forEach(ShowSeat::reserve);
        show.reserve(labels.size());
        BigDecimal total=show.getTicketPrice().multiply(BigDecimal.valueOf(labels.size()));
        Booking booking = bookingRepo.save(new Booking(show, customer, total, labels));
        return BookingResponse.from(booking);


    }
    @Transactional
    public BookingResponse find(Long bookId){
        Booking booking = bookingRepo.findById(bookId).orElseThrow(() -> new ResourceNotFound("Booking Not found"));
        return BookingResponse.from(booking);
    }
    @Transactional
    public List<BookingResponse> findByProfileId(Long profileId){
        if(!customerRepo.existsById(profileId)){
            throw new ResourceNotFound("Prifile Not Found");
        }
        return bookingRepo.findByCustomerIdOrderByBookedAtDesc(profileId).stream().map(BookingResponse::from).toList();
    }
    @Transactional
    public BookingResponse cancel(Long bookingId,Long profileId){
        Booking booking = bookingRepo.findByIdAndCustomerId(bookingId, profileId).orElseThrow(() -> new ResourceNotFound("booking not found"));
        if(booking.getStatus()== BookingStatus.CONFIRMED){
            List<ShowSeat> seats = showSeatRepo.findForUpdate(booking.getShow().getId(), booking.getSeatLabels());
            seats.forEach(ShowSeat::release);
            booking.getShow().release(booking.getSeatLabels().size());
            booking.cancel();
        }
        return BookingResponse.from(booking);
    }
}

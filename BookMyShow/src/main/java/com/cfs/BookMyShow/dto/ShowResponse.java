package com.cfs.BookMyShow.dto;
import com.cfs.BookMyShow.entity.Show;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public record ShowResponse(Long id, MovieResponse movie, TheatreResponse theatre, LocalDateTime startAt,
                           LocalDateTime endAt, BigDecimal ticketPrice,int totalSeats,int availableSeats,
                           List<String> availableSeatsLabels) {

    public static ShowResponse from(Show show, List<String> availableSeatsLabels)
    {
        return new ShowResponse(show.getId(),MovieResponse.from(show.getMovie()),
                TheatreResponse.from(show.getTheatre()),show.getStartsAt(),show.getEndsAt(),show.getTicketPrice(),
                show.getTotalSeats(), show.getTotalSeats(), availableSeatsLabels);
    }
}

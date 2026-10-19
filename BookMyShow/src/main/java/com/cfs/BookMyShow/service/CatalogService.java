package com.cfs.BookMyShow.service;

import com.cfs.BookMyShow.dto.MovieResponse;
import com.cfs.BookMyShow.dto.ShowResponse;
import com.cfs.BookMyShow.dto.TheatreResponse;
import com.cfs.BookMyShow.repository.MovieRepo;
import com.cfs.BookMyShow.repository.ShowRepo;
import com.cfs.BookMyShow.repository.ShowSeatRepo;
import com.cfs.BookMyShow.repository.TheatreRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CatalogService {

    private final MovieRepo movieRepo;
    private final TheatreRepo theatreRepo;
    private final ShowRepo showRepo;
    private final ShowSeatRepo showSeatRepo;

    public CatalogService(MovieRepo movieRepo, TheatreRepo theatreRepo, ShowRepo showRepo, ShowSeatRepo showSeatRepo) {
        this.movieRepo = movieRepo;
        this.theatreRepo = theatreRepo;
        this.showRepo = showRepo;
        this.showSeatRepo = showSeatRepo;
    }
    public List<MovieResponse> movies(){
        return movieRepo.findByActiveTrueOrderByTitle().stream().map(MovieResponse::from).toList();
    }
    public List<TheatreResponse> theatres(String city){
        return theatreRepo.findByCityIgnoreCaseOrderByName(city).stream().map(TheatreResponse::from).toList();
    }
    public List<ShowResponse> shows(String city, LocalDateTime date){
        LocalDateTime from=date.toLocalDate().atStartOfDay();
        return showRepo.findActiveShows(city,from,from.plusDays(1)).stream().map(show->ShowResponse.from(show,showSeatRepo.findAvailableLabels(show.getId()))).toList();

    }


}

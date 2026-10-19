package com.cfs.BookMyShow.repository;

import com.cfs.BookMyShow.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovieRepo extends JpaRepository<Movie,Long> {

    List<Movie> findByActiveTrueOrderByTitle();
    Optional<Movie> findByTitle(String title);

}

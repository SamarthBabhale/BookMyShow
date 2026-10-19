package com.cfs.BookMyShow.repository;

import com.cfs.BookMyShow.entity.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TheatreRepo extends JpaRepository<Theatre,Long> {

    List<Theatre> findByCityIgnoreCaseOrderByName(String city);

    Optional<Theatre> findByNameAndCity(String name, String city);
}

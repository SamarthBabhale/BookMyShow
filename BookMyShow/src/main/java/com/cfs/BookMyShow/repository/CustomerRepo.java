package com.cfs.BookMyShow.repository;

import com.cfs.BookMyShow.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepo extends JpaRepository<Customer,Long> {
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    Optional<Customer> findByemail(String email);
    Optional<Customer> findByPhone(String phone);
}

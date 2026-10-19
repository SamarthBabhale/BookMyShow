package com.cfs.BookMyShow.service;


import com.cfs.BookMyShow.dto.CreateProfileRequest;
import com.cfs.BookMyShow.dto.ProfileResponse;
import com.cfs.BookMyShow.entity.Customer;
import com.cfs.BookMyShow.repository.CustomerRepo;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class ProfileService {
    private final CustomerRepo customerRepo;


    public ProfileService(CustomerRepo customerRepo) {
        this.customerRepo = customerRepo;
    }
    public ProfileResponse create(CreateProfileRequest request){
        String email=request.email().trim().toLowerCase(Locale.ROOT);
        String phone= request.phone();
        if(customerRepo.existsByEmail(email)){
            throw new ProfileConfilt("An account already Exist that Email");

        }
        if(customerRepo.existsByPhone(phone)){
            throw new ProfileConfilt("An account already Exist that Contact");

        }
        return ProfileResponse.from(customerRepo.save(new Customer(request.name().trim(),email,phone)));


    }
    public ProfileResponse login(String identifier){
        String values=identifier==null?"":identifier.trim();
        String phone= values.replaceAll("\\D","");
        Customer customer=values.contains("@")
                ?customerRepo.findByemail(values.toLowerCase(Locale.ROOT)).orElse(null)
                :customerRepo.findByPhone(phone).orElse(null);
        if(customer==null){
            throw new ResourceNotFound("No profile found ");
        }
        return ProfileResponse.from(customer);
    }
    public String normalizePhone(String phone){
        String normalize=phone==null?"":phone.replaceAll("\\D","");
        if(normalize.length()<10 || normalize.length()>15){
            throw new IllegalArgumentException("Enter valid number");
        }
        return normalize;
    }

}

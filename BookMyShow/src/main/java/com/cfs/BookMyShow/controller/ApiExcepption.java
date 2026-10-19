package com.cfs.BookMyShow.controller;

import com.cfs.BookMyShow.dto.ApiError;
import com.cfs.BookMyShow.service.ResourceNotFound;
import com.cfs.BookMyShow.service.SeatUnavaliable;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@RestControllerAdvice
public class ApiExcepption {

    @ExceptionHandler(ResourceNotFound.class)
    ResponseEntity<ApiError> notFound(ResourceNotFound exception, HttpServletRequest request){
        return error(HttpStatus.NOT_FOUND,exception.getMessage(),request);
    }
    @ExceptionHandler({SeatUnavaliable.class, IllegalAccessError.class})
    ResponseEntity<ApiError> conflit(RuntimeException exception,HttpServletRequest request){
        return error(HttpStatus.CONFLICT,exception.getMessage(),request);
    }
    @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class})
    ResponseEntity<ApiError> validation(Exception exception,HttpServletRequest request){
        return error(HttpStatus.BAD_REQUEST,"Req validation failed",request);
    }


    private ResponseEntity<ApiError> error (HttpStatus status,String msg,HttpServletRequest request){
        return ResponseEntity.status(status).body(new ApiError(Instant.now(),status.value(),status.getReasonPhrase(),msg,request.getRequestURI()));
    }

}

package com.cfs.BookMyShow.service;

public class SeatUnavaliable extends RuntimeException {
    public SeatUnavaliable(String message) {
        super(message);
    }
}

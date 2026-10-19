package com.cfs.BookMyShow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateBookingRequest(

        @NotNull Long profileId,
        @NotEmpty @Size(max=8) List<@NotBlank String> seatLabels) {
}
package com.cfs.BookMyShow.dto;

import java.time.Instant;

public record ApiError(Instant timestamp, int status, String error, String msg, String requestURI)
{

}

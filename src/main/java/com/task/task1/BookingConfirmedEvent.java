package com.task.task1;

public record BookingConfirmedEvent(
        Long bookingId,
        Long userId,
        Long showId
) {}

package com.task.task1;

import java.time.LocalDateTime;

public record BookingResponse(
    Long id,
    ShowResponse show,
    String seatNumbers,
    LocalDateTime createdAt
) {
    public record ShowResponse(
        Long id,
        EventResponse event,
        String venueName,
        String auditoriumName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Integer totalSeats,
        Integer bookedSeats
    ) {}

    public record EventResponse(
        Long id,
        String title,
        String city,
        String language,
        String genre,
        Integer durationMinutes,
        String rating
    ) {}
}

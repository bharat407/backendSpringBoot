package com.task.task1;

import java.time.LocalDateTime;

public record ShowRequest(
    Long eventId,
    String venueName,
    String auditoriumName,
    LocalDateTime startTime,
    LocalDateTime endTime,
    Integer totalSeats
) {}

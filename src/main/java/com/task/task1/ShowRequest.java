package com.task.task1;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record ShowRequest(
    @NotNull Long eventId,
    @NotNull String venueName,
    @NotNull String auditoriumName,
    @NotNull @Future(message = "Start time must be in the future") LocalDateTime startTime,
    @NotNull Integer totalSeats
) {}
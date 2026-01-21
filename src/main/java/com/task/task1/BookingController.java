package com.task.task1;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public BookingResponse create(@RequestBody BookingRequest request) {
        return bookingService.book(request);
    }
    @PreAuthorize("hasRole('USER')")
    @GetMapping
    public java.util.List<BookingResponse> list() {
        return bookingService.getUserBookings();
    }
}

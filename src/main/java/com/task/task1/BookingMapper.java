package com.task.task1;

import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingResponse toBookingResponse(Booking booking) {
        if (booking == null) {
            return null;
        }

        BookingResponse.ShowResponse showResponse = toShowResponse(booking.getShow());

        return new BookingResponse(
            booking.getId(),
            showResponse,
            booking.getSeatNumbers(),
            booking.getCreatedAt()
        );
    }

    private BookingResponse.ShowResponse toShowResponse(Show show) {
        if (show == null) {
            return null;
        }

        BookingResponse.EventResponse eventResponse = toEventResponse(show.getEvent());

        return new BookingResponse.ShowResponse(
            show.getId(),
            eventResponse,
            show.getVenueName(),
            show.getAuditoriumName(),
            show.getStartTime(),
            show.getEndTime(),
            show.getTotalSeats(),
            show.getBookedSeats()
        );
    }

    private BookingResponse.EventResponse toEventResponse(Event event) {
        if (event == null) {
            return null;
        }

        return new BookingResponse.EventResponse(
            event.getId(),
            event.getTitle(),
            event.getCity(),
            event.getLanguage(),
            event.getGenre(),
            event.getDurationMinutes(),
            event.getRating()
        );
    }
}

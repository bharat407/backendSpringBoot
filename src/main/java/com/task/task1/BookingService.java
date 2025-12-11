package com.task.task1;

import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class BookingService {

    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final BookingEventPublisher bookingEventPublisher;

    @PersistenceContext
    private EntityManager entityManager;

    public BookingService(ShowRepository showRepository,
                          BookingRepository bookingRepository,
                          UserRepository userRepository,
                          BookingEventPublisher bookingEventPublisher) {
        this.showRepository = showRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.bookingEventPublisher = bookingEventPublisher;
    }

    @Transactional
    public Booking book(BookingRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        Show show = entityManager.find(Show.class, request.showId(), LockModeType.PESSIMISTIC_WRITE);
        if (show == null) {
            throw new IllegalArgumentException("Show not found");
        }

        int available = show.getTotalSeats() - show.getBookedSeats();
        if (request.seatCount() <= 0 || request.seatCount() > available) {
            throw new IllegalStateException("Not enough seats available");
        }

        show.setBookedSeats(show.getBookedSeats() + request.seatCount());
        showRepository.save(show);

        Booking booking = Booking.builder()
                .user(user)
                .show(show)
                .seatNumbers("AUTO_" + request.seatCount())
                .createdAt(LocalDateTime.now())
                .build();

        Booking saved = bookingRepository.save(booking);

        bookingEventPublisher.publish(
                new BookingConfirmedEvent(saved.getId(), user.getId(), show.getId())
        );

        return saved;
    }
}

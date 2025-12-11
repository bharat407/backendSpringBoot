package com.task.task1;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class BookingServiceTest {

    private ShowRepository showRepository;
    private BookingRepository bookingRepository;
    private UserRepository userRepository;
    private BookingEventPublisher bookingEventPublisher;
    private EntityManager entityManager;

    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        showRepository = mock(ShowRepository.class);
        bookingRepository = mock(BookingRepository.class);
        userRepository = mock(UserRepository.class);
        bookingEventPublisher = mock(BookingEventPublisher.class);
        entityManager = mock(EntityManager.class);

        bookingService = new BookingService(
                showRepository,
                bookingRepository,
                userRepository,
                bookingEventPublisher
        );
        // inject entityManager via reflection
        bookingService.getClass()
                .getDeclaredFields();
        TestUtils.setField(bookingService, "entityManager", entityManager);

        // mock logged-in user
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("test@example.com");
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(ctx);
    }

    @Test
    void book_whenEnoughSeats_createsBookingAndPublishesEvent() {
        // given
        User user = User.builder()
                .id(1L)
                .email("test@example.com")
                .build();

        Show show = Show.builder()
                .id(10L)
                .totalSeats(100)
                .bookedSeats(90)
                .build();

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));
        when(entityManager.find(Show.class, 10L, LockModeType.PESSIMISTIC_WRITE))
                .thenReturn(show);

        Booking saved = Booking.builder()
                .id(99L)
                .user(user)
                .show(show)
                .seatNumbers("AUTO_5")
                .createdAt(LocalDateTime.now())
                .build();

        when(bookingRepository.save(any(Booking.class))).thenReturn(saved);

        BookingRequest request = new BookingRequest(10L, 5);

        // when
        Booking result = bookingService.book(request);

        // then
        assertThat(result.getId()).isEqualTo(99L);
        assertThat(show.getBookedSeats()).isEqualTo(95);

        verify(showRepository).save(show);
        verify(bookingEventPublisher).publish(any());
    }

    @Test
    void book_whenNotEnoughSeats_throwsException() {
        User user = User.builder()
                .id(1L)
                .email("test@example.com")
                .build();

        Show show = Show.builder()
                .id(10L)
                .totalSeats(100)
                .bookedSeats(98)
                .build();

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));
        when(entityManager.find(Show.class, 10L, LockModeType.PESSIMISTIC_WRITE))
                .thenReturn(show);

        BookingRequest request = new BookingRequest(10L, 5);

        assertThrows(IllegalStateException.class, () -> bookingService.book(request));
        verify(bookingRepository, never()).save(any());
        verify(bookingEventPublisher, never()).publish(any());
    }
}

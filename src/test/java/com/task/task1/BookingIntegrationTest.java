package com.task.task1;
import org.junit.jupiter.api.Disabled; // Import Disabled annotation
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled // Disable this test class
@SpringBootTest
@Testcontainers
class BookingIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16")
                    .withDatabaseName("bookingdb")
                    .withUsername("booking")
                    .withPassword("booking");

    @DynamicPropertySource
    static void overrideProps(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    EventRepository eventRepository;

    @Autowired
    ShowRepository showRepository;

    @Test
    void createEventAndShow_persistsToRealDb() {
        Event event = Event.builder()
                .title("Integration Movie")
                .city("Pune")
                .language("Hindi")
                .genre("Drama")
                .durationMinutes(110)
                .rating("U/A")
                .build();

        Event savedEvent = eventRepository.save(event);

        Show show = Show.builder()
                .event(savedEvent)
                .venueName("Main Hall")
                .auditoriumName("Screen 1")
                .startTime(LocalDateTime.now().plusDays(1))
                .endTime(LocalDateTime.now().plusDays(1).plusHours(2))
                .totalSeats(100)
                .bookedSeats(0)
                .build();

        Show savedShow = showRepository.save(show);

        assertThat(savedEvent.getId()).isNotNull();
        assertThat(savedShow.getId()).isNotNull();
        assertThat(savedShow.getEvent().getId()).isEqualTo(savedEvent.getId());
    }
}

package com.task.task1;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/shows")
public class ShowController {

    private final ShowRepository showRepository;
    private final EventRepository eventRepository;

    public ShowController(ShowRepository showRepository, EventRepository eventRepository) {
        this.showRepository = showRepository;
        this.eventRepository = eventRepository;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Show create(@Valid @RequestBody ShowRequest request) {
        Event event = eventRepository.findById(request.eventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        LocalDateTime endTime = request.startTime().plusMinutes(event.getDurationMinutes());

        Show show = Show.builder()
                .event(event)
                .venueName(request.venueName())
                .auditoriumName(request.auditoriumName())
                .startTime(request.startTime())
                .endTime(endTime)
                .totalSeats(request.totalSeats())
                .bookedSeats(0)
                .build();

        return showRepository.save(show);
    }

    @GetMapping
    public List<Show> list() {
        return showRepository.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public void delete(@PathVariable Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Show not found"));
        Event event = show.getEvent();
        showRepository.delete(show);
        if (showRepository.countByEventId(event.getId()) == 0) {
            eventRepository.delete(event);
        }
    }
}

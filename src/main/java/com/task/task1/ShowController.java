package com.task.task1;

import org.springframework.web.bind.annotation.*;
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

    @PostMapping
    public Show create(@RequestBody ShowRequest request) {
        Event event = eventRepository.findById(request.eventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        Show show = Show.builder()
                .event(event)
                .venueName(request.venueName())
                .auditoriumName(request.auditoriumName())
                .startTime(request.startTime())
                .endTime(request.endTime())
                .totalSeats(request.totalSeats())
                .bookedSeats(0)
                .build();

        return showRepository.save(show);
    }

    @GetMapping
    public List<Show> list() {
        return showRepository.findAll();
    }
}

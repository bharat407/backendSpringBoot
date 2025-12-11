package com.task.task1;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Event create(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    @GetMapping
    public List<Event> list(@RequestParam(required = false) String city) {
        if (city != null && !city.isBlank()) {
            return eventRepository.findByCityIgnoreCase(city);
        }
        return eventRepository.findAll();
    }
}

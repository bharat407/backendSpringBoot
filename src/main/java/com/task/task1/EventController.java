package com.task.task1;

import jakarta.validation.Valid;
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
    public Event create(@Valid @RequestBody Event event) {
        return eventRepository.save(event);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Event update(@PathVariable Long id, @Valid @RequestBody Event eventDetails) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        event.setTitle(eventDetails.getTitle());
        event.setCity(eventDetails.getCity());
        event.setGenre(eventDetails.getGenre());
        event.setLanguage(eventDetails.getLanguage());
        event.setDurationMinutes(eventDetails.getDurationMinutes());
        event.setRating(eventDetails.getRating());
        return eventRepository.save(event);
    }

    @GetMapping
    public List<Event> list(@RequestParam(required = false) String city) {
        if (city != null && !city.isBlank()) {
            return eventRepository.findByCityIgnoreCase(city);
        }
        return eventRepository.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        eventRepository.deleteById(id);
    }
}

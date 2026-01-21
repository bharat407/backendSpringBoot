package com.task.task1;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {
    List<Show> findByEventId(Long eventId);
    long countByEventId(Long eventId);
}

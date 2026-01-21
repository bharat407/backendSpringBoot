package com.task.task1;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT b FROM Booking b JOIN FETCH b.show s JOIN FETCH s.event WHERE b.user.email = :email")
    java.util.List<Booking> findByUserEmail(String email);
}


package com.task.task1;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String city;
    private String language;
    private String genre;

    private LocalTime time;

    @Min(value = 1, message = "Duration must be a positive number")
    private Integer durationMinutes;

    private String rating;
}

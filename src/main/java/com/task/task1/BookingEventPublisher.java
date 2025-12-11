package com.task.task1;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class BookingEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final String topic;
    private final ObjectMapper objectMapper;

    public BookingEventPublisher(KafkaTemplate<String, String> kafkaTemplate,
                                 @Value("${app.kafka.booking-topic}") String topic,
                                 ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
        this.objectMapper = objectMapper;
    }

    public void publish(BookingConfirmedEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(topic, json);
        } catch (JsonProcessingException e) {
            // Log the error or handle it as appropriate
            e.printStackTrace();
        }
    }
}

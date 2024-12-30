package com.revature.controllers;

import java.util.List;

import org.apache.el.stream.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.revature.models.Booking;
import com.revature.services.BookingService;

@RestController
@RequestMapping("/booking")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookingsHandler() {

        return ResponseEntity.status(200).body(bookingService.getAllBookings());

    }

    @PostMapping("/create")
    public ResponseEntity<Booking> createBookingHandler(@RequestBody Booking booking) {


        Booking actualBooking = bookingService.createBooking(booking);

        if(actualBooking == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.status(201).body(actualBooking);
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Booking> deleteBookingHandler(@PathVariable Long itemId) {

        java.util.Optional<Booking> possibleBooking = bookingService.getBookingById(itemId);

        if(possibleBooking.isEmpty()) {
            return ResponseEntity.status(404).build();
        }

        bookingService.deleteBooking(possibleBooking.get());

        return ResponseEntity.status(204).body(possibleBooking.get());
    }
    
}

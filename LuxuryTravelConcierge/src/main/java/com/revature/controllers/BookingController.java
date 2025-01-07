package com.revature.controllers;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.apache.el.stream.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.revature.models.Booking;
import com.revature.services.BookingService;

@RestController
@RequestMapping("/bookings")
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

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingByIdHandler(@PathVariable Integer id) {

        return ResponseEntity.status(200).body(bookingService.getBookingById(id).get());

    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserIdHandler(@PathVariable Integer userId) {

        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));

    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<Booking>> getBookingsByRoomIdHandler(@PathVariable Integer roomId) {
        return ResponseEntity.ok(bookingService.getBookingsByRoomId(roomId));
    }

    @PostMapping()
    public ResponseEntity<Booking> createBookingHandler(@RequestBody Booking booking) {

        Booking actualBooking = bookingService.createBooking(booking);

        if(actualBooking == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.status(201).body(actualBooking);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBookingHandler(@PathVariable Integer id, @RequestBody Booking booking) {
        if (!bookingService.getBookingById(id).isPresent()) {
            return ResponseEntity.status(404).build();
        }
        booking.setBookingId(id);
        Booking updatedBooking = bookingService.updateBooking(booking);
        return ResponseEntity.status(201).body(updatedBooking);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Booking> deleteBookingHandler(@PathVariable Integer id) {

        java.util.Optional<Booking> possibleBooking = bookingService.getBookingById(id);

        if(possibleBooking.isEmpty()) {
            return ResponseEntity.status(404).build();
        }

        bookingService.deleteBooking(possibleBooking.get());

        return ResponseEntity.status(204).body(possibleBooking.get());
    }
    
}

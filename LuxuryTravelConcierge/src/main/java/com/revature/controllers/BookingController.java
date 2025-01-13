package com.revature.controllers;

import java.time.LocalDate;
import java.util.List;

import org.apache.catalina.connector.Response;
import org.apache.el.stream.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.revature.models.Booking;
import com.revature.services.BookingService;
import com.revature.services.RoomService;

@CrossOrigin(origins = "http://localhost:5173", maxAge=3600, allowCredentials = "true")@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final RoomService roomService;

    @Autowired
    public BookingController(BookingService bookingService, RoomService roomService) {
        this.bookingService = bookingService;
        this.roomService=roomService;
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
        
        
        List<Booking> bookings = bookingService.getAllBookings();
        
        // Check for overlapping bookings using local date and the same room
        for (Booking b : bookings) {
            boolean overlap = false;
            LocalDate bCheckInDate = LocalDate.parse(b.getCheckInDate());
            LocalDate bCheckOutDate = LocalDate.parse(b.getCheckOutDate());
            LocalDate actualCheckInDate = LocalDate.parse(booking.getCheckInDate());
            LocalDate actualCheckOutDate = LocalDate.parse(booking.getCheckOutDate());
            
            if(bCheckInDate.isBefore(actualCheckOutDate) && bCheckOutDate.isAfter(actualCheckInDate) && b.getRoomId() == booking.getRoomId()) {
                overlap = true;
            }
            
            if(overlap) {
                return ResponseEntity.status(409).build();
            }
        }
        
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
        
        roomService.markRoomAsAvailable(possibleBooking.get().getRoomId());
        return ResponseEntity.status(204).body(possibleBooking.get());
    }
    
}

package com.revature.controllers;

import java.time.LocalDate;
import java.util.List;

import org.apache.catalina.connector.Response;
import org.apache.el.stream.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookingsHandler() {

        return ResponseEntity.status(200).body(bookingService.getAllBookings());

    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingByIdHandler(@PathVariable Integer id) {

        return ResponseEntity.status(200).body(bookingService.getBookingById(id).get());

    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserIdHandler(@PathVariable Integer userId) {

        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));

    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<Booking>> getBookingsByRoomIdHandler(@PathVariable Integer roomId) {
        return ResponseEntity.ok(bookingService.getBookingsByRoomId(roomId));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping()
    public ResponseEntity<Booking> createBookingHandler(@RequestBody Booking booking) {
        
        Booking actualBooking = bookingService.createBooking(booking);

        if(actualBooking == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Booking> bookings = bookingService.getAllBookings();

        // Check for overlapping bookings using local date and the same room
        for (Booking b : bookings) {
            boolean sameRoom = b.getRoomId() == booking.getRoomId();
            boolean overlap = LocalDate.parse(booking.getCheckInDate()).isBefore(LocalDate.parse(b.getCheckOutDate())) &&
                              LocalDate.parse(booking.getCheckOutDate()).isAfter(LocalDate.parse(b.getCheckInDate()));
            boolean sameDates = booking.getCheckInDate().equals(b.getCheckInDate()) || 
                                booking.getCheckOutDate().equals(b.getCheckOutDate());
        
            if (sameRoom && (overlap || sameDates)) {
                return ResponseEntity.status(409).build();
            }
        }
        
        roomService.markRoomAsReserved(booking.getRoomId());
        return ResponseEntity.status(201).body(actualBooking);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBookingHandler(@PathVariable Integer id, @RequestBody Booking booking) {
        if (!bookingService.getBookingById(id).isPresent()) {
            return ResponseEntity.status(404).build();
        }
        booking.setBookingId(id);
        Booking updatedBooking = bookingService.updateBooking(booking);
        return ResponseEntity.status(201).body(updatedBooking);

    }

    @PreAuthorize("hasRole('ADMIN')")
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

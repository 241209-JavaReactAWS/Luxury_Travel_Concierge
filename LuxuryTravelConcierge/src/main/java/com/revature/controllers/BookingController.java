package com.revature.controllers;

import java.time.LocalDate;
import java.util.List;

import com.revature.DTO.BookingListDTO;
import com.revature.enums.BookingStatus;
import com.revature.services.BookingServiceImpl;
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
    private final BookingServiceImpl bookingServiceImpl;

    @Autowired
    public BookingController(BookingServiceImpl bookingServiceImpl,BookingService bookingService, RoomService roomService) {
        this.bookingServiceImpl = bookingServiceImpl;
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
    public List<BookingListDTO> listUserBookings(@PathVariable int userId) {
        return bookingServiceImpl.listUserBookings(userId);
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
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable String id,
            @RequestParam BookingStatus status
    ) {
        return ResponseEntity.ok(bookingService.updateStatus(id, status));
    }
    
}

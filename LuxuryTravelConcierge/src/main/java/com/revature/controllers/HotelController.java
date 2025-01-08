package com.revature.controllers;

import com.revature.models.Booking;
import com.revature.models.Hotel;
import com.revature.models.Room;
import com.revature.services.BookingService;
import com.revature.services.HotelService;

import com.revature.services.RoomService;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:5173", maxAge=3600, allowCredentials = "true")@RestController
@RequestMapping("/hotel")
public class HotelController {
    private final HotelService hotelService;
    private final BookingService bookingService;


    @Autowired
    public HotelController(HotelService hotelService,BookingService bookingService) {
        this.hotelService = hotelService;
        this.bookingService = bookingService;
    }
    // @GetMapping
    // public ResponseEntity<List<Hotel>> getAllHotelsHandler(){
    //     return new ResponseEntity<>(hotelService.getAllHotels(),HttpStatus.OK);
    // }

    @GetMapping
    public List<Hotel> getHotelByFiltering( @RequestParam(name = "name", required = false) String name,
                                            @RequestParam(name = "location", required = false) String location){
        if (name != null) {
            return hotelService.searchAllByHotelName(name);
        } else if (location != null) {
            return hotelService.searchByHotelLocation(location);
        } else {
            return hotelService.getAllHotels(); 
        }
    }

    @PostMapping
    public ResponseEntity<Hotel> createHandler(@RequestBody Hotel hotel) {
        Hotel possibleHotel = hotelService.createNewHotel(hotel);

        if (possibleHotel == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(possibleHotel, HttpStatus.CREATED);

    }

    @GetMapping("data/{hotelId}")
    public ResponseEntity<List<Booking>> getAllBookingsOfHotel(@PathVariable int hotelId){
        Optional<Hotel> existingHotel = hotelService.getHotelById(hotelId);
        if (existingHotel.isEmpty()) {
            return ResponseEntity.notFound().build(); // Hotel Not Found
        }

        try {
            Set<Room> rooms = existingHotel.get().getRooms();
            List<Booking> allBookings = new ArrayList<>();
            for (Room i : rooms) {
                List<Booking> bookings = bookingService.getBookingsByRoomId(i.getRoomId());
                for (Booking j : bookings) {
                    j.setUserId(0);
                    allBookings.add(j);
                }
            }
            return ResponseEntity.status(200).body(allBookings);
        }
        catch(Exception e){
            return ResponseEntity.notFound().build();
        }

    }

    @PutMapping("{hotelId}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable int hotelId, @RequestBody Hotel hotel){

        if (hotel.getHotelId() != hotelId) {
            return ResponseEntity.badRequest().build(); // Bad Request
        }
    
        Optional<Hotel> existingHotel = hotelService.getHotelById(hotelId);
        if (existingHotel.isEmpty()) {
            return ResponseEntity.notFound().build(); // Hotel Not Found
        }
        
        Hotel updatedHotel = hotelService.updateHotel(hotel,hotelId);
        return ResponseEntity.ok(updatedHotel);
    }

    @DeleteMapping("{hotelId}")
    public ResponseEntity<Void> deleteHotel(@PathVariable int hotelId, @RequestBody Hotel hotel){

        Optional<Hotel> existingHotel = hotelService.getHotelById(hotelId);
        if (existingHotel.isEmpty()) {
            return ResponseEntity.notFound().build(); // Hotel Not Found
        }

        hotelService.deleteHotel(hotel, hotelId);
        return ResponseEntity.ok().build();
    }


    


}


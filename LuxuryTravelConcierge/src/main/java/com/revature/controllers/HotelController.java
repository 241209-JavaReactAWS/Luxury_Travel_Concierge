package com.revature.controllers;

import com.revature.models.Hotel;
import com.revature.services.HotelService;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/hotel")
public class HotelController {
    private final HotelService hotelService;

    @Autowired
    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
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


package com.revature.controllers;

import com.revature.models.Hotel;
import com.revature.services.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hotel")
public class HotelController {
    private final HotelService hotelService;

    @Autowired
    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }
    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotelsHandler(){
        return new ResponseEntity<>(hotelService.getAllHotels(),HttpStatus.OK);
    }


    public ResponseEntity<Hotel> createHandler(@RequestBody Hotel hotel) {
        Hotel possibleHotel = hotelService.createNewHotel(hotel);

        if (possibleHotel == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(possibleHotel, HttpStatus.CREATED);

    }


}


package com.revature.controllers;

import com.revature.models.Hotel;
import com.revature.models.Room;
import com.revature.services.AdminService;
import com.revature.services.HotelService;
import com.revature.services.RoomService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@RestController
@CrossOrigin(origins = "http://localhost:5173", maxAge=3600, allowCredentials = "true")
@RequestMapping("room")
public class RoomController {

    private final RoomService roomService;
    private final HotelService hotelService;


    @Autowired
    public RoomController(RoomService roomService, HotelService hotelService) {
        this.roomService = roomService;
        this.hotelService = hotelService;
    }


    @GetMapping("{hotelId}")
    public ResponseEntity<List<Room>> getAllRoomsInHotel(@PathVariable Integer hotelId, HttpSession session){
        Optional<Hotel> gottenHotel = hotelService.getHotelById(hotelId);
        if(gottenHotel.isEmpty()) ResponseEntity.notFound().build();

        List<Room> allRooms = roomService.getAllRoomsByHotel(gottenHotel.get());

        return ResponseEntity.ok(allRooms);
    }


    @PostMapping("{hotelId}")
    public ResponseEntity<Room> createNewRoom(@RequestBody Room room,@PathVariable Integer hotelId ,HttpSession session){
        Optional<Hotel> gottenHotel = hotelService.getHotelById(hotelId);
        if(gottenHotel.isEmpty()) ResponseEntity.notFound().build();

        Integer curAdminId = (Integer)session.getAttribute("adminId");
        if(session.isNew() || curAdminId==null) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        if(gottenHotel.get().getAdmin().getAdminId() != curAdminId)  return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

        room.setHotel(gottenHotel.get());
        Room newRoom = roomService.createNewRoom(room);

        if(newRoom == null) ResponseEntity.status(HttpStatus.CONFLICT).body("Already Exists");
        return ResponseEntity.status(HttpStatus.CREATED).body(newRoom);
    }

    @PutMapping("{hotelId}")
    public ResponseEntity<Room> changeRoom(@RequestBody Room room,@PathVariable Integer hotelId ,HttpSession session){
        Optional<Hotel> gottenHotel = hotelService.getHotelById(hotelId);
        if(gottenHotel.isEmpty()) ResponseEntity.notFound().build();

        Integer curAdminId = (Integer)session.getAttribute("adminId");
        if(session.isNew() || curAdminId==null) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        if(gottenHotel.get().getAdmin().getAdminId() != curAdminId)  return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

        Room newRoom = roomService.updateRoomInfo(room);

        if(newRoom == null) ResponseEntity.noContent().build();
        return ResponseEntity.status(HttpStatus.OK).body(newRoom);
    }

    @DeleteMapping("{hotelId}")
    public ResponseEntity<Room> deleteRoom(@RequestBody Room room,@PathVariable Integer hotelId ,HttpSession session){
        Optional<Hotel> gottenHotel = hotelService.getHotelById(hotelId);
        if(gottenHotel.isEmpty()) ResponseEntity.notFound().build();

        Integer curAdminId = (Integer)session.getAttribute("adminId");
        if(session.isNew() || curAdminId==null) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        if(gottenHotel.get().getAdmin().getAdminId() != curAdminId)  return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

        Room newRoom = roomService.updateRoomInfo(room);

        if(newRoom == null) ResponseEntity.notFound().build();
        return ResponseEntity.status(HttpStatus.OK).body(newRoom);
    }
}

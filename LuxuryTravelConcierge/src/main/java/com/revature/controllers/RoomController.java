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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@RestController
@CrossOrigin(origins = "http://localhost:5173", maxAge=3600, allowCredentials = "true")
@RequestMapping("room")
public class RoomController {

    private final RoomService roomService;
    private final HotelService hotelService;
    private final AdminService adminService;


    @Autowired
    public RoomController(RoomService roomService, HotelService hotelService, AdminService adminService) {
        this.roomService = roomService;
        this.hotelService = hotelService;
        this.adminService = adminService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("{hotelId}")
    public ResponseEntity<List<Room>> getAllRoomsInHotel(@PathVariable Integer hotelId, @AuthenticationPrincipal UserDetails userDetails){
        Optional<Hotel> gottenHotel = hotelService.getHotelById(hotelId);
        if(gottenHotel.isEmpty()) ResponseEntity.notFound().build();

        List<Room> allRooms = roomService.getAllRoomsByHotel(gottenHotel.get());

        return ResponseEntity.ok(allRooms);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("{hotelId}")
    public ResponseEntity<Room> createNewRoom(@RequestBody Room room,@PathVariable Integer hotelId ,@AuthenticationPrincipal UserDetails userDetails){
        Optional<Hotel> gottenHotel = hotelService.getHotelById(hotelId);
        if(gottenHotel.isEmpty()) ResponseEntity.notFound().build();

        Integer curAdminId = adminService.getAdminByUsername(userDetails.getUsername()).get().getAdminId();
        if(!userDetails.isAccountNonExpired() || !userDetails.isAccountNonLocked() || !userDetails.isCredentialsNonExpired() || !userDetails.isEnabled()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if(gottenHotel.get().getAdmin().getAdminId() != curAdminId)  return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

        room.setHotel(gottenHotel.get());
        Room newRoom = roomService.createNewRoom(room);

        if(newRoom == null) ResponseEntity.status(HttpStatus.CONFLICT).body("Already Exists");
        return ResponseEntity.status(HttpStatus.CREATED).body(newRoom);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("{hotelId}")
    public ResponseEntity<Room> changeRoom(@RequestBody Room room,@PathVariable Integer hotelId ,@AuthenticationPrincipal UserDetails userDetails){
        Optional<Hotel> gottenHotel = hotelService.getHotelById(hotelId);
        if(gottenHotel.isEmpty()) ResponseEntity.notFound().build();

        Integer curAdminId = adminService.getAdminByUsername(userDetails.getUsername()).get().getAdminId();
        if(!userDetails.isAccountNonExpired() || !userDetails.isAccountNonLocked() || !userDetails.isCredentialsNonExpired() || !userDetails.isEnabled()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if(gottenHotel.get().getAdmin().getAdminId() != curAdminId)  return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

        Room newRoom = roomService.updateRoomInfo(room);

        if(newRoom == null) ResponseEntity.noContent().build();
        return ResponseEntity.status(HttpStatus.OK).body(newRoom);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("{hotelId}")
    public ResponseEntity<Room> deleteRoom(@RequestBody Room room,@PathVariable Integer hotelId ,@AuthenticationPrincipal UserDetails userDetails){
        Optional<Hotel> gottenHotel = hotelService.getHotelById(hotelId);
        if(gottenHotel.isEmpty()) ResponseEntity.notFound().build();

        Integer curAdminId = adminService.getAdminByUsername(userDetails.getUsername()).get().getAdminId();
        if(!userDetails.isAccountNonExpired() || !userDetails.isAccountNonLocked() || !userDetails.isCredentialsNonExpired() || !userDetails.isEnabled()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if(gottenHotel.get().getAdmin().getAdminId() != curAdminId)  return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

        Room newRoom = roomService.updateRoomInfo(room);

        if(newRoom == null) ResponseEntity.notFound().build();
        return ResponseEntity.status(HttpStatus.OK).body(newRoom);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/markAsReserved/{roomId}")
    public ResponseEntity<Room> markRoomAsReserved(@PathVariable int roomId) {
        Room updatedRoom = roomService.markRoomAsReserved(roomId);
        if (updatedRoom == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedRoom);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/markAsAvailable/{roomId}")
    public ResponseEntity<Room> markRoomAsAvailable(@PathVariable int roomId) {
        Room updatedRoom = roomService.markRoomAsAvailable(roomId);
        if (updatedRoom == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedRoom);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/updateStatus/{roomId}")
    public ResponseEntity<Room> updateRoomStatus(@PathVariable int roomId, @RequestParam String status) {
        Room updatedRoom = roomService.updateRoomStatus(roomId, status);
        if (updatedRoom == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedRoom);
    }
}

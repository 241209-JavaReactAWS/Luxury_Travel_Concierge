package com.revature.controllers;

import com.revature.DAOS.DTOs.UserDTO;
import com.revature.models.Admin;
import com.revature.models.Hotel;
import com.revature.security.JwtUtil;
import com.revature.services.AdminService;
import com.revature.services.HotelService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:5173", maxAge=3600, allowCredentials = "true")
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;
    private final HotelService hotelService;

    @Autowired
    public AdminController(AdminService adminService, HotelService hotelService) {
        this.adminService = adminService;
        this.hotelService = hotelService;
    }
    @GetMapping
    @Transactional
    public ResponseEntity<List<Admin>> getAllAdminsHandler(){
        return new ResponseEntity<>(adminService.getAllAdmins(),HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Admin> registerHandler(@RequestBody Admin admin) {
        Admin possibleAdmin = adminService.createNewAdmin(admin);

        if (possibleAdmin == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(possibleAdmin, HttpStatus.CREATED);

    }

    @PostMapping("/login")
    public ResponseEntity<?> loginHandler(@RequestBody Admin admin, @AuthenticationPrincipal UserDetails userDetails, HttpServletResponse http) {
        Optional<Admin> possibleAdmin = adminService.loginAdmin(admin);

        if (possibleAdmin.isPresent()) {

            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(possibleAdmin.get().getUsername());
            userDTO.setUserId(possibleAdmin.get().getAdminId());
            userDTO.setToken(JwtUtil.generateToken(possibleAdmin.get().getUsername()));
            userDTO.setRole("ADMIN");
            return ResponseEntity.ok().body(userDTO);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/logout")
    public ResponseEntity<?> logoutHandler(@AuthenticationPrincipal UserDetails userDetails) {
        SecurityContextHolder.clearContext();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/hotels")
    public ResponseEntity<Set<Hotel>> getAllHotelsHandler(@AuthenticationPrincipal UserDetails userDetails){
        Integer curAdminId = adminService.getAdminByUsername(userDetails.getUsername()).get().getAdminId();
        if(!userDetails.isAccountNonExpired() || !userDetails.isAccountNonLocked() || !userDetails.isCredentialsNonExpired() || !userDetails.isEnabled()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Set<Hotel> hotels = adminService.getAllOwnedHotelsById(curAdminId);

        return ResponseEntity.ok().body(hotels);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/hotels")
    public ResponseEntity<Admin> addHotelHandler(@AuthenticationPrincipal UserDetails userDetails,
                                                      @RequestBody Hotel hotel){
        Integer curAdminId = adminService.getAdminByUsername(userDetails.getUsername()).get().getAdminId();
        if(!userDetails.isAccountNonExpired() || !userDetails.isAccountNonLocked() || !userDetails.isCredentialsNonExpired() || !userDetails.isEnabled()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<Admin> targetAdmin = adminService.getAdminById(curAdminId);


        if (targetAdmin.isPresent()){
            Hotel newHotel = new Hotel();
            newHotel.setName(hotel.getName());
            newHotel.setImageUrl(hotel.getImageUrl());
            newHotel.setLocation(hotel.getLocation());
            newHotel.setDescription(hotel.getDescription());
            newHotel.setAdmin(targetAdmin.get());
            Optional<Admin> newAdmin = adminService.getAdminById(curAdminId);
            hotelService.createNewHotel(newHotel);
            return new ResponseEntity<>(newAdmin.get(), HttpStatus.OK);
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/hotels/{hotelId}")
    public ResponseEntity<Hotel> updateHotelHandler(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Hotel hotel,@PathVariable Integer hotelId){
        Integer curAdminId = adminService.getAdminByUsername(userDetails.getUsername()).get().getAdminId();
        if(!userDetails.isAccountNonExpired() || !userDetails.isAccountNonLocked() || !userDetails.isCredentialsNonExpired() || !userDetails.isEnabled()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<Admin> targetAdmin = adminService.getAdminById(curAdminId);
        if (targetAdmin.isPresent()){
            Hotel targetHotel = hotelService.updateHotel(hotel,hotelId);
            return new ResponseEntity<>(targetHotel,HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }


    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/hotels/{hotelId}")
    public ResponseEntity<?> removeHotelHandler(@AuthenticationPrincipal UserDetails userDetails,@PathVariable Integer hotelId) {
        Integer curAdminId = adminService.getAdminByUsername(userDetails.getUsername()).get().getAdminId();
        if (!userDetails.isAccountNonExpired() || !userDetails.isAccountNonLocked() || !userDetails.isCredentialsNonExpired() || !userDetails.isEnabled()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            // Check if hotel exists
            Optional<Hotel> hotel = hotelService.getHotelById(hotelId);
            if (hotel.isEmpty()) {
                return new ResponseEntity<>("Hotel not found", HttpStatus.NOT_FOUND);
            }

            if (!(hotel.get().getAdmin().getAdminId() == curAdminId)) {
                return new ResponseEntity<>("Unauthorized to delete this hotel", HttpStatus.FORBIDDEN);
            }
            hotelService.deleteHotel(hotel.get(), hotelId);
            return new ResponseEntity<>("Hotel successfully deleted", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting hotel: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}

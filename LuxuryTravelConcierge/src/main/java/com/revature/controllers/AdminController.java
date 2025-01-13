package com.revature.controllers;

import com.revature.models.Admin;
import com.revature.models.Hotel;
import com.revature.services.AdminService;
import com.revature.services.HotelService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> loginHandler(@RequestBody Admin admin, HttpSession session, HttpServletResponse http) {
        Optional<Admin> possibleAdmin = adminService.loginAdmin(admin);

        if (possibleAdmin.isPresent()) {

            session.setAttribute("username", possibleAdmin.get().getUsername());
            session.setAttribute("adminId", possibleAdmin.get().getAdminId());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutHandler(HttpSession session) {
        session.invalidate();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/hotels")
    public ResponseEntity<Set<Hotel>> getAllHotelsHandler(HttpSession session){
        Integer curAdminId = (Integer)session.getAttribute("adminId");
        if(session.isNew() || curAdminId==null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Set<Hotel> hotels = adminService.getAllOwnedHotelsById(curAdminId);

        return ResponseEntity.ok().body(hotels);
    }

    @PostMapping("/hotels")
    public ResponseEntity<Admin> addHotelHandler(HttpSession session,
                                                      @RequestBody Hotel hotel){
        Integer curAdminId = (Integer)session.getAttribute("adminId");
        if(session.isNew()||curAdminId==null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Optional<Admin> targetAdmin = adminService.getAdminById(curAdminId);


        if (targetAdmin.isPresent()){
            Hotel newHotel = new Hotel();
            newHotel.setName(hotel.getName());
            newHotel.setImageUrl(hotel.getImageUrl());
            newHotel.setLocation(hotel.getLocation());
            newHotel.setDescription(hotel.getDescription());
            newHotel.setAdmin(targetAdmin.get());
            Hotel createdHotel = hotelService.createNewHotel(newHotel);
            Optional<Admin> newAdmin = adminService.getAdminById(curAdminId);
            return new ResponseEntity<>(newAdmin.get(), HttpStatus.OK);
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/hotels/{hotelId}")
    public ResponseEntity<Hotel> updateHotelHandler(HttpSession session, @RequestBody Hotel hotel,@PathVariable Integer hotelId){
        Integer curAdminId = (Integer)session.getAttribute("adminId");
        if(session.isNew()||curAdminId==null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
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
    @DeleteMapping("/hotels/{hotelId}")
    public ResponseEntity<?> removeHotelHandler(HttpSession session,@PathVariable Integer hotelId){
        Integer curAdminId = (Integer) session.getAttribute("adminId");
        if(session.isNew()||curAdminId==null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        try {
            // Check if hotel exists
            Optional<Hotel> hotel = hotelService.getHotelById(hotelId);
            if (hotel.isEmpty()) {
                return new ResponseEntity<>("Hotel not found", HttpStatus.NOT_FOUND);
            }

            if (!(hotel.get().getAdmin().getAdminId()==curAdminId)) {
                return new ResponseEntity<>("Unauthorized to delete this hotel", HttpStatus.FORBIDDEN);
            }
            hotelService.deleteHotel(hotel.get(),hotelId);
            return new ResponseEntity<>("Hotel successfully deleted",HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Error deleting hotel: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }





//    @DeleteMapping("/hotels")
//    public ResponseEntity<Admin> removeHotelHandler(HttpSession session,
//                                                 @RequestBody Hotel hotel){
//        Integer curAdminId = (Integer)session.getAttribute("adminId");
//        if(session.isNew()||curAdminId==null){
//            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
//        }
//        Optional<Admin> targetAdmin = adminService.getAdminById(curAdminId);
//
//
//        if (targetAdmin.isPresent()){
//            Hotel targetHotel = new Hotel();
//            targetHotel.setName(hotel.getName());
//            targetHotel.setImageUrl(hotel.getImageUrl());
//            targetHotel.setLocation(hotel.getLocation());
//            targetHotel.setAdmin(targetAdmin.get());
//            Hotel removedHotel = hotelService.removeTargetHotel(targetHotel);
//            Admin newAdmin = adminService.removeHotelFromAdmin(targetAdmin.get(),removedHotel);
//            return new ResponseEntity<>(newAdmin, HttpStatus.OK);
//        }
//        else{
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }
    

}

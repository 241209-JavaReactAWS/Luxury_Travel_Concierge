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
    public ResponseEntity<?> loginHandler(@RequestBody Admin admin, HttpSession session) {
        Optional<Admin> possibleAdmin = adminService.loginAdmin(admin);

        if (possibleAdmin.isPresent()) {

            session.setAttribute("username", possibleAdmin.get().getUsername());
            session.setAttribute("adminId", possibleAdmin.get().getAdminId());
//            session.setAttribute("role", possibleAdmin.get().getRole());
        }
        return possibleAdmin
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());

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
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Set<Hotel> hotels = adminService.getAllOwnedHotelsById(curAdminId);

        return new ResponseEntity<>(hotels, HttpStatus.OK);
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
            newHotel.setAdmin(targetAdmin.get());
            Hotel createdHotel = hotelService.createNewHotel(newHotel);
            Admin newAdmin = adminService.addHotelToAdmin(targetAdmin.get(),createdHotel);
            return new ResponseEntity<>(newAdmin, HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(value="cookie")
    public ResponseEntity removeLoginCookie(HttpServletResponse servlet){
        Cookie cookie = new Cookie("Roomy_Residents_Admin_Id",null);
        cookie.setMaxAge(0);
        cookie.setPath("/userauth");
        servlet.addCookie(cookie);
        return ResponseEntity.status(HttpStatus.OK).body("Logged Out");
    }

    @GetMapping(value = "cookie")
    public ResponseEntity getLoginCookie(@CookieValue(value = "Roomy_Residents_Admin_Id", defaultValue = "none") String cookie){
        if(cookie.equals("none")) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Cookie Found");
        return ResponseEntity.status(HttpStatus.OK).body(cookie);
    }
}

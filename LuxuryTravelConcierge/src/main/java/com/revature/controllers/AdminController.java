package com.revature.controllers;

import com.revature.models.Admin;
import com.revature.models.Hotel;
import com.revature.services.AdminService;
import jakarta.servlet.http.HttpSession;
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

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
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
//    @PostMapping("/hotels")
//    public ResponseEntity<Set<Hotel>> addHotelHandler(HttpSession session){
//
//    }
}

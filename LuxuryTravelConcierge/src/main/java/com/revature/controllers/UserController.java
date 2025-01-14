package com.revature.controllers;

import java.util.List;
import java.util.Set;

import com.revature.DAOS.DTOs.UserDTO;
import com.revature.models.Admin;
import com.revature.security.JwtUtil;
import com.revature.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.revature.exceptions.NoAddressException;
import com.revature.exceptions.NoEmailException;
import com.revature.exceptions.NoFirstNameException;
import com.revature.exceptions.NoLastNameException;
import com.revature.exceptions.NoUserFoundException;
import com.revature.exceptions.PasswordException;
import com.revature.exceptions.UsernameException;
import com.revature.exceptions.UsernameExistsException;
import com.revature.exceptions.WrongPasswordException;
import com.revature.models.Hotel;
import com.revature.models.User;
import com.revature.services.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "http://localhost:5173", maxAge=3600, allowCredentials = "true")
@RequestMapping("users")
public class UserController {
    private final UserService userService;
    private final AdminService adminService;

    @Autowired
    public UserController(UserService userService, AdminService adminService) {
        this.userService = userService;
        this.adminService = adminService;

    }

    @PostMapping("/register")
    public ResponseEntity registerUserHandler(@RequestBody User user){
        try{
            User returnedUser = userService.registerUser(user);

            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(returnedUser.getUsername());
            userDTO.setUserId(returnedUser.getUserId());
            userDTO.setToken(JwtUtil.generateToken(returnedUser.getUsername()));
            userDTO.setRole("CUSTOMER");

            return ResponseEntity.status(HttpStatus.OK).body(userDTO);
        }
        catch(UsernameException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is invalid");
        }
        catch (UsernameExistsException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is taken");
        }
        catch (PasswordException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password is invalid");
        }
        catch(NoEmailException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is invalid");
        }
        catch(NoAddressException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Address is invalid");
        }
        catch(NoFirstNameException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No first name");
        }
        catch(NoLastNameException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No last name");
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.SEE_OTHER).body("Something went wrong");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> userLoginHandler(@RequestBody User user){
        try{

            User returnedUser = userService.userLogin(user);

            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(returnedUser.getUsername());
            userDTO.setUserId(returnedUser.getUserId());
            userDTO.setToken(JwtUtil.generateToken(returnedUser.getUsername()));

            return ResponseEntity.status(HttpStatus.OK).body(userDTO);
        }
        catch(WrongPasswordException | NoUserFoundException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.SEE_OTHER).build();
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/favorites")
    public ResponseEntity<Set<Hotel>> getUserFavorites(@AuthenticationPrincipal UserDetails userDetails) {
        if(!userDetails.isAccountNonExpired() || !userDetails.isAccountNonLocked() || !userDetails.isCredentialsNonExpired() || !userDetails.isEnabled()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            Set<Hotel> favorites = userService.getFavoritesForUser((String) userDetails.getUsername());
            return ResponseEntity.ok(favorites);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/favorites/{hotelId}")
    public ResponseEntity<User> addHotelToFavorites(@AuthenticationPrincipal UserDetails userDetails,@PathVariable int hotelId){
        if(!userDetails.isAccountNonExpired() || !userDetails.isAccountNonLocked() || !userDetails.isCredentialsNonExpired() || !userDetails.isEnabled()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User returnedUser = userService.addHotelToFavorites( (String) userDetails.getUsername(), hotelId);
        if (returnedUser == null){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(returnedUser);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/favorites/{hotelId}")
    public ResponseEntity<User> removeHotelFromFavorites(@AuthenticationPrincipal UserDetails userDetails,@PathVariable int hotelId){
        if(!userDetails.isAccountNonExpired() || !userDetails.isAccountNonLocked() || !userDetails.isCredentialsNonExpired() || !userDetails.isEnabled()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User returnedUser = userService.removeHotelFromFavorites((String) userDetails.getUsername(), hotelId);
        // if (returnedUser == null){
        //     return ResponseEntity.badRequest().build();
        // }
        return ResponseEntity.ok(returnedUser);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/user")
    public ResponseEntity obtainUserSession(@AuthenticationPrincipal UserDetails userDetails){
        if(!userDetails.isAccountNonExpired() || !userDetails.isAccountNonLocked() || !userDetails.isCredentialsNonExpired() || !userDetails.isEnabled()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Object object = userDetails.getUsername();
        if(object == null) return ResponseEntity.notFound().build();
        String username = object.toString();
        String role;
        if(userService.findUserByUsername(username).isPresent()) return ResponseEntity.ok("CUSTOMER");
        if(adminService.getAdminByUsername(username).isPresent()) return ResponseEntity.ok("ADMIN");
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/userId")
    public ResponseEntity getUserId(@AuthenticationPrincipal UserDetails userDetails){
        Object object = userDetails.getUsername();
        if(object == null) return ResponseEntity.notFound().build();
        String username = object.toString();
        User user = userService.findUserByUsername(username).get();
        return ResponseEntity.ok(user.getUserId());

    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/currentUser")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails){
        Object object = userDetails.getUsername();
        if(object == null) return ResponseEntity.notFound().build();
        String username = object.toString();
        User user = userService.findUserByUsername(username).get();
        return ResponseEntity.ok(user);
    }
}

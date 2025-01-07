package com.revature.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/register")
    public ResponseEntity registerUserHandler(@RequestBody User user){
        try{
            User newUser = userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.OK).body(newUser);
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
            return ResponseEntity.status(HttpStatus.SEE_OTHER).body(null);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<User> userLoginHandler(@RequestBody User user){
        try{
            User returnedUser = userService.userLogin(user);
            return ResponseEntity.status(HttpStatus.OK).body(returnedUser);
        }
        catch(WrongPasswordException | NoUserFoundException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.SEE_OTHER).build();
        }
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<Hotel>> getUserFavorites(HttpSession session) {
        if (session.isNew() || session.getAttribute("username") == null) {
            return ResponseEntity.status(401).build();
        }
        List<Hotel> favorites = userService.getFavoritesForUser((String) session.getAttribute("username"));
        return ResponseEntity.ok(favorites);
    }

    
    @PostMapping("/favorites/{hotelId}")
    public ResponseEntity<User> addHotelToFavorites(HttpSession session, @PathVariable int hotelId){
        if (session.isNew() || session.getAttribute("username") == null){
            return ResponseEntity.status(401).build();
        }
        User returnedUser = userService.addHotelToFavorites( (String) session.getAttribute("username"), hotelId);
        if (returnedUser == null){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(returnedUser);
    }

    @DeleteMapping("/favorites/{hotelId}")
    public ResponseEntity<User> removeHotelFromFavorites(HttpSession session, @PathVariable int hotelId){
        if (session.isNew() || session.getAttribute("username") == null){
            return ResponseEntity.status(401).build();
        }
        User returnedUser = userService.removeHotelFromFavorites((String) session.getAttribute("username"), hotelId);
        if (returnedUser == null){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(returnedUser);
    }
}

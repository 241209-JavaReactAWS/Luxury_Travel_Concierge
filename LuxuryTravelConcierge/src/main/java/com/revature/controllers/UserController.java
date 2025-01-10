package com.revature.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            return ResponseEntity.status(HttpStatus.SEE_OTHER).body("Something went wrong");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<User> userLoginHandler(@RequestBody User user,HttpSession session,HttpServletResponse http){
        try{
            User returnedUser = userService.userLogin(user);

            session.setAttribute("username", returnedUser.getUsername());

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
            System.out.println(session.getAttribute("username"));
            return ResponseEntity.status(401).build();
        }
        try {
            List<Hotel> favorites = userService.getFavoritesForUser((String) session.getAttribute("username"));
            return ResponseEntity.ok(favorites);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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

    @GetMapping("user")
    public ResponseEntity obtainUserSession(HttpSession session){
        if(session.getAttribute("username") == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok().build();
    }

}

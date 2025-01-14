package com.revature.services;

import com.revature.DAOS.HotelDAO;
import com.revature.DAOS.RoomDAO;
import com.revature.DAOS.UserDAO;
import com.revature.exceptions.*;
import com.revature.models.Hotel;
import com.revature.models.Room;
import com.revature.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {
    private final UserDAO userDAO;
    private final RoomDAO roomDAO;
    private final HotelDAO hotelDAO;

    @Autowired
    public UserService(UserDAO userDAO, RoomDAO roomDAO,HotelDAO hotelDAO) {
        this.userDAO = userDAO;
        this.roomDAO = roomDAO;
        this.hotelDAO = hotelDAO;
    }

    public Optional<User> findUserById(int userId){
        return userDAO.findById(userId);
    }

    public Optional<User> findUserByUsername(String username){
        return userDAO.findUserByUsername(username);
    }

    // register user
    public User registerUser(User user) throws PasswordException, UsernameException, UsernameExistsException, NoEmailException, NoAddressException, NoFirstNameException, NoLastNameException {
        if(user.getPassword().length() < 5){
            throw new PasswordException();
        }
        if(user.getUsername().trim().isEmpty()){
            throw new UsernameException();
        }
        if(userDAO.findUserByUsername(user.getUsername()).isPresent()){
            throw new UsernameExistsException();
        }
        if(user.getEmail().isEmpty()){
            throw new NoEmailException();
        }
        if(user.getAddress().isEmpty()){
            throw new NoAddressException();
        }
        if(user.getFirst_name().isEmpty()){
            throw new NoFirstNameException();
        }
        if(user.getLast_name().isEmpty()){
            throw new NoLastNameException();
        }
        return userDAO.save(user);
    }

    // login user
    public User userLogin(User user){
        Optional<User> possibleUser = userDAO.findUserByUsername(user.getUsername());
        if (possibleUser.isEmpty()){
            throw new NoUserFoundException("No user found");
        }
        User returnedUser = possibleUser.get();

        if(returnedUser.getPassword().equals(user.getPassword())){
            return returnedUser;
        }
        else{
            throw new WrongPasswordException("Wrong password");
        }

    }

    @Transactional
    public Set<Hotel> getFavoritesForUser(String username) {
        return userDAO.findFavoritesByUsername(username);
    }
    
    @Transactional
    public User addHotelToFavorites(String username, int hotelId){
        Optional<User> possibleUser = userDAO.findUserByUsername(username);
        Optional<Hotel> possibleHotel = hotelDAO.findById(hotelId);
        if (possibleUser.isEmpty() || possibleHotel.isEmpty()){
            return null;
        }
        User returnedUser = possibleUser.get();
        Hotel returnedHotel = possibleHotel.get();
        Set<Hotel> favorites = returnedUser.getFavorites();
        favorites.add(returnedHotel);
        returnedUser.setFavorites(favorites);
        return userDAO.save(returnedUser);
    }

    
    public User removeHotelFromFavorites(String username, int hotelId){
        Optional<User> possibleUser = userDAO.findUserByUsername(username);
        Optional<Hotel> possibleHotel = hotelDAO.findById(hotelId);
        if (possibleUser.isEmpty() || possibleHotel.isEmpty()){
            return null;
        }
        User returnedUser = possibleUser.get();
        Hotel returnedHotel = possibleHotel.get();
        Set<Hotel> favorites = returnedUser.getFavorites();
        favorites.remove(returnedHotel);
        returnedUser.setFavorites(favorites);
        return userDAO.save(returnedUser);
    }

}

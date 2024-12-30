package com.revature.services;

import com.revature.DAOS.UserDAO;
import com.revature.exceptions.*;
import com.revature.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserSevice {
    private final UserDAO userDAO;

    @Autowired
    public UserSevice(UserDAO userDAO) {
        this.userDAO = userDAO;
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
}

package com.revature.services;

import com.revature.DAOS.UserDAO;
import com.revature.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserSevice {
    private final UserDAO userDAO;

    @Autowired
    public UserSevice(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

}

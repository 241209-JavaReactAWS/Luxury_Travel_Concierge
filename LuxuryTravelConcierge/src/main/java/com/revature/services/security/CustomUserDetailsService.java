package com.revature.services.security;

import com.revature.models.*;
import com.revature.DAOS.AdminDAO;
import com.revature.DAOS.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserDAO userDAO;
    private final AdminDAO adminDAO;

    @Autowired
    public CustomUserDetailsService(UserDAO userDAO, AdminDAO adminDAO) {
        this.userDAO = userDAO;
        this.adminDAO = adminDAO;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<com.revature.models.User> user = userDAO.findUserByUsername(username);
        if (user.isPresent()) {
            return User.builder()
                    .username(user.get().getUsername())
                    .password(user.get().getPassword())
                    .roles("CUSTOMER")
                    .build();
        }

        return adminDAO.findByUsername(username)
                .map(admin -> org.springframework.security.core.userdetails.User.builder()
                        .username(admin.getUsername())
                        .password(admin.getPassword())
                        .roles("ADMIN")
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}

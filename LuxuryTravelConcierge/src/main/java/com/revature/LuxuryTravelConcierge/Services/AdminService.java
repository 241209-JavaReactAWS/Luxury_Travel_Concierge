package com.revature.LuxuryTravelConcierge.Services;


import com.revature.LuxuryTravelConcierge.DAOs.AdminDAO;

import com.revature.LuxuryTravelConcierge.Models.Admin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;


@Service
public class AdminService {
    private final AdminDAO adminDAO;


    @Autowired
    public AdminService(AdminDAO adminDAO) {
        this.adminDAO = adminDAO;
    }

    public Optional<Admin> getAdminById(int adminId) {
        return adminDAO.findById(adminId);
    }

    public Optional<Admin> getAdminByUsername(String username) {
        return adminDAO.findByUsername(username);
    }

    public List<Admin> getAllAdmins() {
        return adminDAO.findAll();
    }

    public Admin createNewAdmin(Admin admin) {
        Optional<Admin> account = adminDAO.findByUsername(admin.getUsername());
        if (account.isEmpty()) {
            return adminDAO.save(admin);
        }
        return null;
    }

    public Optional<Admin> loginAdmin(Admin admin) {
        Optional<Admin> account = adminDAO.findByUsername(admin.getUsername());
        return account.filter(acc -> acc.getPassword().equals(admin.getPassword()));
    }
}

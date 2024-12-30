package com.revature.LuxuryTravelConcierge.DAOs;

import com.revature.LuxuryTravelConcierge.Models.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminDAO extends JpaRepository<Admin,Integer> {
    Optional<Admin> findByUsername(String username);
}

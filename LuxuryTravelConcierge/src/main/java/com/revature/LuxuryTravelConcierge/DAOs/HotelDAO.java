package com.revature.LuxuryTravelConcierge.DAOs;

import com.revature.LuxuryTravelConcierge.Models.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HotelDAO extends JpaRepository<Hotel,Integer> {
    Optional<Hotel> findByName(String name);
}

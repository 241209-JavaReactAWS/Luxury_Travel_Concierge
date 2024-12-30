package com.revature.DAOS;

import com.revature.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingDAO extends JpaRepository<Booking, Long> {
    
}

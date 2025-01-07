package com.revature.DAOS;

import com.revature.models.Booking;
import com.revature.models.Room;
import com.revature.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingDAO extends JpaRepository<Booking, Integer> {
     List<Booking> findByUserId(int user);
     List<Booking> findByRoomId(int room);
}

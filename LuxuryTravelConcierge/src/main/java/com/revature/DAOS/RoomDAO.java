package com.revature.DAOS;

import com.revature.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface RoomDAO extends JpaRepository<Room,Integer> {
    Optional<Room> findByRoomNumber(int roomNumber);
}

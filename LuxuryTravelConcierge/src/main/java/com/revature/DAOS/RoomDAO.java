package com.revature.DAOS;

import com.revature.models.Hotel;
import com.revature.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface RoomDAO extends JpaRepository<Room,Integer> {
    Optional<Room> findByRoomNumber(int roomNumber);
    List<Room> findByHotel(Hotel hotel);
    List<Room> findByHotelAndStatus(Hotel hotel, String status);
    List<Room> findByHotelAndIsAvailable(Hotel hotel, boolean isAvailable);
    List<Room> findByRoomTypeAndIsAvailableAndMaxOccupancy(String roomType, boolean isAvailable, int maxOccupancy);
    List<Room> findByRoomTypeAndIsAvailable(String roomType, boolean isAvailable);
    List<Room> findByIsAvailableAndMaxOccupancy(boolean isAvailable, int maxOccupancy);
    List<Room> findByRoomTypeAndMaxOccupancy(String roomType, int maxOccupancy);
    List<Room> findByRoomType(String roomType);
    List<Room> findByIsAvailable(boolean isAvailable);
    List<Room> findByMaxOccupancy(int maxOccupancy);
}

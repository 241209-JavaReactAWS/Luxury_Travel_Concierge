package com.revature.services;

import com.revature.DAOS.RoomDAO;
import com.revature.models.Hotel;
import com.revature.models.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    private final RoomDAO roomDAO;

    @Autowired
    public RoomService(RoomDAO roomDAO) {
        this.roomDAO = roomDAO;
    }

    public Optional<Room> getRoomById(int roomId) {
        return roomDAO.findById(roomId);
    }

    public Optional<Room> getRoomByRoomNumber(int roomNumber) {
        return roomDAO.findByRoomNumber(roomNumber);
    }

    public List<Room> getAllRooms() {
        return roomDAO.findAll();
    }

    public List<Room> getAllRoomsByHotel(Hotel hotel){
        return roomDAO.findByHotel(hotel);
    }

    public Room createNewRoom(Room room) {
        Optional<Room> targetRoom = roomDAO.findByRoomNumber(room.getRoomNumber());
        if (targetRoom.isEmpty() && room.getRoomNumber() >= 0 && room.getMaxOccupancy() > 0) {
            return roomDAO.save(room);
        }
        return null;
    }

    public Room updateRoomInfo(Room room){
        if(roomDAO.findById(room.getRoomId()).isEmpty()) return null;
        Optional<Room> targetRoom = roomDAO.findByRoomNumber(room.getRoomNumber());
        if (room.getRoomNumber() >= 0 && room.getMaxOccupancy() > 0) {
            return roomDAO.save(room);
        }
        return null;
    }

    public Room deleteRoomById(Room room){
        Optional<Room> found = roomDAO.findById(room.getRoomId());
        if(found.isEmpty()) return null;
        roomDAO.delete(room);
        return found.get();
    }

    public Room markRoomAsReserved(int roomId) {
        Optional<Room> targetRoom = roomDAO.findById(roomId);
        if (targetRoom.isPresent()) {
            Room room = targetRoom.get();
            room.setAvailable(false);
            room.setStatus("Reserved");
            return roomDAO.save(room);
        }
        return null;
    }

    public Room markRoomAsAvailable(int roomId) {
        Optional<Room> targetRoom = roomDAO.findById(roomId);
        if (targetRoom.isPresent()) {
            Room room = targetRoom.get();
            room.setAvailable(true);
            room.setStatus("Available");
            return roomDAO.save(room);
        }
        return null;
    }

    public Room updateRoomStatus(int roomId, String status) {
        Optional<Room> targetRoom = roomDAO.findById(roomId);
        if (targetRoom.isPresent()) {
            Room room = targetRoom.get();
            room.setStatus(status);
            if ("Available".equalsIgnoreCase(status)) {
                room.setAvailable(true);
            } else {
                room.setAvailable(false);
            }
            return roomDAO.save(room);
        }
        return null;
    }

    public List<Room> searchByRoomTypeIsAvailabiltyAndMaxOccupancy(String roomType, boolean isAvailable, int maxOccupancy) {
        return roomDAO.findByRoomTypeAndIsAvailableAndMaxOccupancy(roomType, isAvailable, maxOccupancy);
    }

    public List<Room> searchByRoomTypeAndIsAvailabilty(String roomType, boolean isAvailable) {
        return roomDAO.findByRoomTypeAndIsAvailable(roomType, isAvailable);
    }

    public List<Room> searchByIsAvailabiltyAndMaxOccupancy(boolean isAvailable, int maxOccupancy) {
        return roomDAO.findByIsAvailableAndMaxOccupancy(isAvailable, maxOccupancy);
    }

    public List<Room> searchByRoomTypeAndMaxOccupancy(String roomType, int maxOccupancy) {
        return roomDAO.findByRoomTypeAndMaxOccupancy(roomType, maxOccupancy);
    }

    public List<Room> searchByRoomType(String roomType) {
        return roomDAO.findByRoomType(roomType);
    }
    
    public List<Room> searchByIsAvailable(boolean isAvailable) {
        return roomDAO.findByIsAvailable(isAvailable);
    }
    
    public List<Room> searchByMaxOccupancy(int maxOccupancy) {
        return roomDAO.findByMaxOccupancy(maxOccupancy);
    }
    

}

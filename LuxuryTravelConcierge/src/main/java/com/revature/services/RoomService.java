package com.revature.services;

import com.revature.DAOS.RoomDAO;
import com.revature.models.Room;

import java.util.List;
import java.util.Optional;

public class RoomService {
    private final RoomDAO roomDAO;

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

    public Room createNewRoom(Room room) {
        Optional<Room> targetRoom = roomDAO.findByRoomNumber(room.getRoomNumber());
        if (targetRoom.isEmpty()) {
            return roomDAO.save(room);
        }
        return null;
    }

}

package com.revature.models;

import jakarta.persistence.*;

@Entity
@Table(name="room",schema="public")
public class Room {
    @Column(name="roomId")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int roomId;
    @Column(name="roomNumber",unique = true,nullable = false)
    private int roomNumber;
    @Column(name="roomType",nullable = false)
    private String roomType;

    @ManyToOne
    @JoinColumn(name="hotelId")
    private Hotel hotel;

    @Column(name="imageUrl")
    private String imageUrl;
    @Column(name="maxOccupancy",nullable = false)
    private int maxOccupancy;

    public Room() {
    }

    public Room(int roomId, int roomNumber, String roomType, Hotel hotel, String imageUrl, int maxOccupancy) {
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.hotel = hotel;
        this.imageUrl = imageUrl;
        this.maxOccupancy = maxOccupancy;
    }

    public int getRoomId() {
        return roomId;
    }

    public void setRoomId(int roomId) {
        this.roomId = roomId;
    }

    public int getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(int roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public Hotel getHotel() {
        return hotel;
    }

    public void setHotel(Hotel hotel) {
        this.hotel = hotel;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getMaxOccupancy() {
        return maxOccupancy;
    }

    public void setMaxOccupancy(int maxOccupancy) {
        this.maxOccupancy = maxOccupancy;
    }
}

package com.revature.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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

    @ManyToOne(cascade=CascadeType.REMOVE)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    @JoinColumn(name="hotelId")
    private Hotel hotel;

    @Column(name="imageUrl")
    private String imageUrl;

    @Column(name="maxOccupancy",nullable = false)
    private int maxOccupancy;

    @Column(name="isAvailable", nullable = false)
    private boolean isAvailable;

    @Column(name="status", nullable = false)
    private String status;

    @Column(name="price", nullable = false)
    private double price;

    public Room() {
    }

    public Room(int roomId, int roomNumber, String roomType, Hotel hotel, String imageUrl, int maxOccupancy, boolean isAvailable, String status, double price) {
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.hotel = hotel;
        this.imageUrl = imageUrl;
        this.maxOccupancy = maxOccupancy;
        this.isAvailable = true;
        this.status = "Available";
        this. price=price;
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

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}

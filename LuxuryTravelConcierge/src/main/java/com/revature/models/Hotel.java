package com.revature.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.Set;
@Entity
@Table(name="hotel",schema="public")
public class Hotel {
    @Column(name="hotelId")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int hotelId;

    @Column(name="hotelName",unique = true,nullable = false)
    private String name;

    @Column(name="location",nullable = false)
    private String location;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name="adminId")
    private Admin admin;
    
    private String imageUrl;

    @OneToMany(mappedBy = "hotel")
    private Set<Room> rooms;

    public Hotel() {
    }

    public Hotel(int hotelId, String name, String location, Admin admin, String imageUrl, Set<Room> rooms) {
        this.hotelId = hotelId;
        this.name = name;
        this.location = location;
        this.admin = admin;
        this.imageUrl = imageUrl;
        this.rooms = rooms;
    }

    public int getHotelId() {
        return hotelId;
    }

    public void setHotelId(int hotelId) {
        this.hotelId = hotelId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Set<Room> getRooms() {
        return rooms;
    }

    public void setRooms(Set<Room> rooms) {
        this.rooms = rooms;
    }
}

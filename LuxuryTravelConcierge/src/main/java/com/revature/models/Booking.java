package com.revature.models;


import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;

@Entity
@Table(name = "bookings")
public class Booking {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bookingId;

    //Will use a foreign key to room id later
    @OneToOne(fetch = FetchType.LAZY)
    @JoinTable(name = "room",
        joinColumns = @JoinColumn(name="roomId"),
            inverseJoinColumns = @JoinColumn(name = "bookingId")
    )
    private Room room;

    //Will need to link this to a user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinTable(name = "user",
            joinColumns = @JoinColumn(name="userId"),
            inverseJoinColumns = @JoinColumn(name = "bookingId")
    )
    private User user;

    //Can use SQL TO_Date to convert varchar to dates
    private String checkInDate;

    private String checkOutDate;

    private int price;
    
    public Booking(int bookingId, Room room, User user, String checkInDate, String checkOutDate, int price) {
        this.bookingId = bookingId;
        this.room = room;
        this.user = user;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.price = price;
    }

    public Booking() {
    }


    public int getBookingId() {
        return bookingId;
    }

    public void setBookingId(int bookingId) {
        this.bookingId = bookingId;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public User getUserId() {
        return user;
    }

    public void setUserId(User userId) {
        this.user = userId;
    }

    public String getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(String checkInDate) {
        this.checkInDate = checkInDate;
    }

    public String getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(String checkOutDate) {
        this.checkOutDate = checkOutDate;
    }


    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }


}

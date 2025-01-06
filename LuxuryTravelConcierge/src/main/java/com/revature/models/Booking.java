package com.revature.models;


import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookingId;

    //Will use a foreign key to room id later
    @OneToOne
    @JoinColumn(name = "roomId", nullable = false)
    private Integer roomId;

    //Will need to link this to a user
    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private Integer userId;

    //Can use SQL TO_Date to convert varchar to dates
    private String checkInDate;

    private String checkOutDate;

    private Integer price;
    

    public Integer getBookingId() {
        return bookingId;
    }

    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }
    
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
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


    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }


}

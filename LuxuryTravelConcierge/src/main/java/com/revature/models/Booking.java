package com.revature.models;


import jakarta.persistence.*;
import com.revature.enums.BookingStatus;

@Entity
@Table(name = "bookings")
public class Booking {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bookingId;

    //Will use a foreign key to room id later
    private int roomId;

    private int hotelId;

    //Will need to link this to a user
    private int userId;

    //Can use SQL TO_Date to convert varchar to dates
    private String checkInDate;

    private String checkOutDate;

    private int price;

    private int numberOfGuests;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;




    public Booking() {
    }

    public Booking(int bookingId, int hotelId, int roomId, int userId, String checkInDate, String checkOutDate, int price, BookingStatus status) {
        this.bookingId = bookingId;
        this.hotelId = hotelId;
        this.roomId = roomId;
        this.userId = userId;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.price = price;
        this.status = status;
    }

    public int getHotelId() {
        return hotelId;
    }

    public void setHotelId(int hotelId) {
        this.hotelId = hotelId;
    }

    public int getBookingId() {
        return this.bookingId;
    }

    public void setBookingId(int bookingId) {
        this.bookingId = bookingId;
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

    public int getRoomId() {
        return roomId;
    }

    public void setRoomId(int roomId) {
        this.roomId = roomId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    
    public int getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(int numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}

package com.revature.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.revature.DAOS.BookingDAO;
import com.revature.models.Booking;

public class BookingService {
    
    private BookingDAO bookingDAO;

    @Autowired
    public BookingService(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
    }

    public List<Booking> getAllBookings() {
        return bookingDAO.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingDAO.findById(id);
    }

    public Booking createBooking(Booking booking) {
        return bookingDAO.save(booking);
    }

    public void deleteBooking(Booking booking) {
        bookingDAO.delete(booking);
    }

    public Booking updateBooking(Booking booking) {
        return bookingDAO.save(booking);
    }


}

package com.revature.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

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

    public List<Booking> getBookingsByUserId(Long id) {
        return bookingDAO.findByUserId(id);
    }

    public List<Booking> getBookingsByRoomId(Long id) {
        return bookingDAO.findByRoomId(id);
    }

    @Transactional
    public Booking createBooking(Booking booking) {
        return bookingDAO.save(booking);
    }

    @Transactional
    public void deleteBooking(Booking booking) {
        bookingDAO.delete(booking);
    }

    @Transactional
    public Booking updateBooking(Booking booking) {
        return bookingDAO.save(booking);
    }




}

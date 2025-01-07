package com.revature.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.revature.DAOS.BookingDAO;
import com.revature.models.Booking;
import org.springframework.stereotype.Service;

@Service
public class BookingService {
    
    private BookingDAO bookingDAO;

    @Autowired
    public BookingService(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
    }

    public List<Booking> getAllBookings() {
        return bookingDAO.findAll();
    }

    public Optional<Booking> getBookingById(Integer id) {
        return bookingDAO.findById(id);
    }

    public List<Booking> getBookingsByUserId(Integer id) {
        return bookingDAO.findByUserId(id);
    }

    public List<Booking> getBookingsByRoomId(Integer id) {
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

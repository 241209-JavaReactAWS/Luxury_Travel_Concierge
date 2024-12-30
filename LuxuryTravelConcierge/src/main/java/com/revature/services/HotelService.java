package com.revature.services;

import com.revature.DAOS.HotelDAO;
import com.revature.models.Hotel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelService {
    private final HotelDAO hotelDAO;
    @Autowired
    public HotelService(HotelDAO hotelDAO) {
        this.hotelDAO = hotelDAO;
    }

    public Optional<Hotel> getHotelById(int hotelId) {
        return hotelDAO.findById(hotelId);
    }

    public Optional<Hotel> getHotelByHotelNumber(String hotelName) {
        return hotelDAO.findByName(hotelName);
    }

    public List<Hotel> getAllHotels() {
        return hotelDAO.findAll();
    }

    public Hotel createNewHotel(Hotel hotel) {
        Optional<Hotel> targetHotel = hotelDAO.findByName(hotel.getName());
        if (targetHotel.isEmpty()) {
            return hotelDAO.save(hotel);
        }
        return null;
    }

}

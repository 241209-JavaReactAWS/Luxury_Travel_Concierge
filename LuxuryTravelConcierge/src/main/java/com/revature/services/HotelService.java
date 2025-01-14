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


    public Hotel updateHotel(Hotel updatedHotel, int hotelId){
        return hotelDAO.findById(hotelId)
            .map(existingHotel -> {
                if(!updatedHotel.getName().isBlank())existingHotel.setName(updatedHotel.getName());
                if(!updatedHotel.getDescription().isBlank())existingHotel.setDescription(updatedHotel.getDescription());
                if(!updatedHotel.getLocation().isBlank())existingHotel.setLocation(updatedHotel.getLocation());
                if(!updatedHotel.getImageUrl().isBlank())existingHotel.setImageUrl(updatedHotel.getImageUrl());
                return hotelDAO.save(existingHotel);
            })
            .orElseThrow(() -> new IllegalArgumentException("Hotel not found"));
    }

    public void deleteHotel(Hotel hotel, int hotelId)  {

        if(hotelDAO.existsById(hotel.getHotelId())){
            hotelDAO.deleteById(hotel.getHotelId());
        }
        else {
            throw new IllegalArgumentException("Hotel not found");
        }        
    }

    public List<Hotel> searchAllByHotelName(String name){
        return hotelDAO.findAllByname(name);
    }

    public List<Hotel> searchByHotelLocation(String location){
        return hotelDAO.findAllByLocation(location);
    }

    public List<Hotel> searchByNameAndLocation(String name, String location) {
        // Implementation depends on your repository layer
        return hotelDAO.findByNameContainingIgnoreCaseAndLocationContainingIgnoreCase(name, location);
    }



}

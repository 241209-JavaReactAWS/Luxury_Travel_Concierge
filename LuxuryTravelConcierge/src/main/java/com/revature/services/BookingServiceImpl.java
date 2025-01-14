package com.revature.services;

import com.revature.DAOS.BookingDAO;
import com.revature.DAOS.HotelDAO;
import com.revature.DAOS.RoomDAO;
import com.revature.DTO.BookingListDTO;
import com.revature.models.Booking;
import com.revature.models.Hotel;
import com.revature.models.Room;
import com.revature.services.BookingService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingServiceImpl {
    private final BookingDAO bookingDAO;
    private final HotelDAO hotelDAO;
    private final RoomDAO roomDAO;

    public BookingServiceImpl(
            BookingDAO bookingDAO,
            HotelDAO hotelDAO,
            RoomDAO roomDAO
    ) {
        this.bookingDAO = bookingDAO;
        this.hotelDAO = hotelDAO;
        this.roomDAO = roomDAO;
    }


    public List<BookingListDTO> listUserBookings(int userId) {
        List<Booking> bookings = bookingDAO.findByUserId(userId);

        // 批量查询酒店信息
        Set<Integer> hotelIds = bookings.stream()
                .map(Booking::getHotelId)
                .collect(Collectors.toSet());
        Map<Integer, Hotel> hotelMap = hotelDAO.findAllById(hotelIds)
                .stream()
                .collect(Collectors.toMap(Hotel::getHotelId, hotel -> hotel));

        // 批量查询房间类型信息
        Set<Integer> roomIds = bookings.stream()
                .map(Booking::getRoomId)
                .collect(Collectors.toSet());
        Map<Integer, Room> roomTypeMap = roomDAO.findAllById(roomIds)
                .stream()
                .collect(Collectors.toMap(Room::getRoomId, roomType -> roomType));

        // 转换DTO
        return bookings.stream()
                .map(booking -> {
                    BookingListDTO dto = new BookingListDTO();
                    dto.setBookingId(booking.getBookingId());

                    Hotel hotel = hotelMap.get(booking.getHotelId());
                    dto.setHotelName(hotel != null ? hotel.getName() : "Unknown Hotel");

                    Room room = roomTypeMap.get(booking.getRoomId());
                    dto.setRoomTypeName(room != null ? room.getRoomType() : "Unknown Room Type");

                    // 设置其他订单信息
                    dto.setCheckInDate(booking.getCheckInDate());
                    dto.setCheckOutDate(booking.getCheckOutDate());
                    dto.setTotalPrice(booking.getPrice());
                    dto.setStatus(booking.getStatus());

                    return dto;
                })
                .collect(Collectors.toList());
    }
}
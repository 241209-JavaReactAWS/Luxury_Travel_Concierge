import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Supplementaries from '../../SupplementaryClass';
import { Booking } from '../../interfaces/Booking';

// 定义预订数据的接口


// API 响应接口
// interface ApiResponse {
//   data: Booking[];
//   message: string;
//   status: number;
// }

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userId = 2;
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('Fetching URL:', `${Supplementaries.serverLink}bookings/user/${userId}`);
      const response = await axios.get(
        `${Supplementaries.serverLink}bookings/user/${userId}`, 
        { withCredentials: true }
      );
       
      setBookings(response.data);
    } catch (err) {
      const errorMessage = 
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to fetch bookings';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure to cancel this booking?')) {
      return;
    }

    try {
      await axios.delete(
        `${Supplementaries.serverLink}bookings/${bookingId}`,
        { withCredentials: true }
      );
      
      setBookings(prevBookings => 
        prevBookings.filter(booking => booking.bookingId !== bookingId)
      );
    } catch (err) {
      const errorMessage = 
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to cancel booking';
      alert(errorMessage);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // if (bookings.length === 0) {
  //   return <div>No bookings found</div>;
  // }

  return (
    <div>
      <h1>My Bookings</h1>
      {bookings && bookings.length > 0 ?(
        bookings.map(booking => (
        <div key={booking.bookingId}>
          <h2>Hotel: {booking.hotelName}</h2>
          <h3>Room: {booking.roomTypeName}</h3>
          <div>Check-in: {booking.checkInDate}</div>
          <div>Check-out: {booking.checkOutDate}</div>
          <div>Number of Guests: {booking.numberOfGuests}</div>
          <div>Status: {booking.status}</div>
          <div>Price: ${booking.totalPrice}</div>
          {booking.bookingId !== undefined && booking.status === 'PENDING' &&(
            <button 
              onClick={() => handleCancelBooking(booking.bookingId)}
              style={{ color: 'red' }}
            >
              Cancel Booking
            </button>
          )}
          <hr />
        </div>
      )))
      :(
        <div>No bookings found</div>
      )
      }
    </div>
  );
};

export default BookingList;
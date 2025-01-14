import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Supplementaries from '../../SupplementaryClass';
import { Booking } from './Booking';
import './BookingList.css';

const useCurrentUser = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${Supplementaries.serverLink}users/currentUser`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        console.log("fetching"+response.data.userId);
        setUserId(response.data.userId);
        console.log(userId);
      } catch (err) {
        const errorMessage = 
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Failed to fetch user';
        setError(errorMessage);
      }
    };

    fetchCurrentUser();
  }, []);
  return { userId, error };
}
const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useCurrentUser();
  const userId = currentUser.userId;
  console.log(userId);
  useEffect(() => {
    fetchBookings();
  }, [userId]);
  
  const fetchBookings = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      console.log('Fetching URL:', `${Supplementaries.serverLink}bookings/user/${userId}`);

      const response = await axios.get(
        `${Supplementaries.serverLink}bookings/user/${userId}`, 
        { withCredentials:true, headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
      }}
      );
      console.log(response.data)
      setBookings(response.data);
    } catch (err) {
      const errorMessage = 
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to fetch bookings';
      setError(errorMessage);
    } finally {
      setLoading(false);

  };
  }

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure to cancel this booking?')) {
      return;
    }

    try {
      await axios.put(
        `${Supplementaries.serverLink}bookings/${bookingId}/cancel`,
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

  if (bookings.length === 0) {
    return <div>No bookings found</div>;
  }
  
  
  

  return (
    <div className="booking-container">
      <h1 className="booking-title">My Bookings</h1>
      <div className="booking-list">
        {bookings.map(booking => (
          <div key={booking.bookingId} className="booking-card">
            <div className="card-header">
              <div className="hotel-info">
                <h2 className="hotel-name">{booking.hotelName}</h2>
                <h3 className="room-type">{booking.roomTypeName}</h3>
              </div>
              <div className="price-info">
                <div className="total-price">${booking.totalPrice}</div>
                <div className={`status-badge ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </div>
              </div>
            </div>
            
            <div className="booking-details">
              <div className="dates">
                <div className="detail-item">
                  <span className="detail-label">Check-in:</span>
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </div>
                <div className="detail-item">
                  <span className="detail-label">Check-out:</span>
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </div>
              </div>
              <div className="guest-info">
                <div className="detail-item">
                  <span className="detail-label">Guests:</span>
                  {booking.numberOfGuests}
                </div>
              </div>
            </div>

            {booking.bookingId !== undefined && booking.status === 'PENDING' && (
              <button 
                onClick={() => handleCancelBooking(booking.bookingId)}
                className="cancel-button"
              >
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
    )
}

export default BookingList;

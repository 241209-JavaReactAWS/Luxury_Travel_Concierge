import { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { Booking } from "../../interfaces/Booking";
import Supplementaries from "../../SupplementaryClass";

export default function BookingAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(Supplementaries.serverLink + 'bookings',{headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
    }});
      console.log(response.data);
      setBookings(response.data);
    } catch (error) {
      console.error(error);
      setNotification({ open: true, message: 'Failed to load bookings', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAcceptBooking = async (booking: Booking) => {
    try {
      const response = await axios.put(Supplementaries.serverLink + `bookings/${booking.bookingId}`, {
        ...booking,
        status: 'CONFIRMED'
      }, { headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
    }});
      setBookings(prev => prev.map(b =>
        b.bookingId === booking.bookingId ? { ...b, status: 'CONFIRMED' } : b
      ));
      setNotification({ open: true, message: 'Booking accepted successfully', severity: 'success' });
    } catch (error) {
      console.log(booking);
      setNotification({ open: true, message: 'Failed to accept booking', severity: 'error' });
    }
  };

  const handleDenyBooking = async (booking: Booking) => {
    try {
      const response = await axios.put(`${Supplementaries.serverLink}bookings/${booking.bookingId}`, {
        ...booking,
        status: 'CANCELLED'
      }, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } });
      setBookings(prev => prev.map(b =>
        b.bookingId === booking.bookingId ? { ...b, status: 'CANCELLED' } : b
      ));
      setNotification({ open: true, message: 'Booking denied successfully', severity: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Failed to deny booking', severity: 'error' });
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    try {
      await axios.delete(`${Supplementaries.serverLink}bookings/${bookingId}`, { headers : { Authorization: "Bearer " + localStorage.getItem("token") } });
      setBookings(prev => prev.filter(booking => booking.bookingId !== bookingId));
      setNotification({ open: true, message: 'Booking deleted successfully', severity: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Failed to delete booking', severity: 'error' });
    }
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };

  const handleOpenDetailDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenDetailDialog(true);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <div>
      <h1>Admin Booking Management</h1>

      {loading ? <p>Loading...</p> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Room ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Check-In Date</TableCell>
                <TableCell>Check-Out Date</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.bookingId}>
                  <TableCell>{booking.bookingId}</TableCell>
                  <TableCell>{booking.roomId}</TableCell>
                  <TableCell>{booking.userId}</TableCell>
                  <TableCell>{booking.checkInDate}</TableCell>
                  <TableCell>{booking.checkOutDate}</TableCell>
                  <TableCell>{booking.numberOfGuests}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>
                    {booking.status === 'PENDING' ? (
                      <>
                        <Button
                          color="primary"
                          onClick={() => booking.bookingId !== undefined && handleAcceptBooking(booking)}
                          aria-hidden="false"
                        >
                          Accept
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => booking.bookingId !== undefined && handleDenyBooking(booking)}
                          aria-hidden="false"
                        >
                          Deny
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => handleOpenDetailDialog(booking)}
                      >
                        View Details
                      </Button>
                    )}               
                    <Button
                    color="error"
                    onClick={() => booking.bookingId !== undefined && handleDeleteBooking(booking.bookingId)}
                  >
                    Delete
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}


      {selectedBooking && (
        <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog}>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogContent>
          <p><strong>Booking ID:</strong> {selectedBooking.bookingId}</p>
            <p><strong>Room ID:</strong> {selectedBooking.roomId}</p>
            <p><strong>User ID:</strong> {selectedBooking.userId}</p>
            <p><strong>Check-In Date:</strong> {selectedBooking.checkInDate}</p>
            <p><strong>Check-Out Date:</strong> {selectedBooking.checkOutDate}</p>
            <p><strong>Capacity:</strong> {selectedBooking.numberOfGuests}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetailDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

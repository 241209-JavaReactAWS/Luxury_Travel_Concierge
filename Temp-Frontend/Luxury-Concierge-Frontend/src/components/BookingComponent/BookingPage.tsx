import { useEffect, useState } from "react";
import "./Bookingform.css";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Snackbar } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Booking } from "../../interfaces/Booking";
import axios from "axios";
import { Room } from "../../interfaces/Room";
import dayjs from "dayjs";
import Supplementaries from "../../SupplementaryClass";
import MuiAlert from '@mui/material/Alert';

function BookingPage(props: Room) {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState<DialogProps['scroll']>('paper');
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newBooking, setNewBooking] = useState<Booking>({
    bookingId: 0,
    roomId: 0,
    userId: 0,
    checkInDate: "",
    checkOutDate: "",
    price: 0,
    numberOfGuests: 1,
    status: 'Pending'
  });

  useEffect(() => {
    const fetchUserIdAndBookedDates = async () => {
      try {
        const userResponse = await axios.get(`${Supplementaries.serverLink}users/userId`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        });
        const userId = userResponse.data?.userId;
        console.log("Fetched userId:", userId);

        setNewBooking((prevBooking) => ({
          ...prevBooking,
          roomId: props.roomId,
          userId: userId || 0,
        }));

        const bookedResponse = await axios.get(`${Supplementaries.serverLink}bookings/room/${props.roomId}`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        });

        const dates = bookedResponse.data.map((booking: Booking) => {
          let dates = [];
          const checkIn = dayjs(booking.checkInDate);
          const checkOut = dayjs(booking.checkOutDate);
          for (let date = checkIn; date.isBefore(checkOut); date = date.add(1, 'day')) {
            dates.push(date.format('YYYY-MM-DD'));
          }
          return dates;
        }).flat();

        setBookedDates(dates);

        console.log("Booked dates for room:", dates);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (props.roomId) {
      fetchUserIdAndBookedDates();
    }
  }, [props.roomId]);

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBooking = async () => {
    try {
      const res = await axios.post(`${Supplementaries.serverLink}bookings`, newBooking, { 
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      handleClose();
    } catch (error) {
      console.error("Error booking:", error);
      setErrorMessage("Booking failed. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const handleDateChange = (date: any, field: string) => {
    const formattedDate = date ? date.format('YYYY-MM-DD') : '';
    
    const updatedBooking = { ...newBooking, [field]: formattedDate };

    if (updatedBooking.checkInDate && updatedBooking.checkOutDate) {
      const checkIn = dayjs(updatedBooking.checkInDate);
      const checkOut = dayjs(updatedBooking.checkOutDate);
      
      const daysDifference = checkOut.diff(checkIn, 'day') + 1;
      const price = daysDifference * 10;
      updatedBooking.price = price;
    }
    setNewBooking(updatedBooking);
  };

  const increaseCapacity = () => {
    if (newBooking.numberOfGuests < props.maxOccupancy) {
      setNewBooking({
        ...newBooking,
        numberOfGuests: newBooking.numberOfGuests + 1
      });
    }
  };

  const decreaseCapacity = () => {
    if (newBooking.numberOfGuests > 1) {
      setNewBooking({
        ...newBooking,
        numberOfGuests: newBooking.numberOfGuests - 1
      });
    }
  };

  const shouldDisableDate = (date: any) => {
    const dateStr = date.format('YYYY-MM-DD');
    return bookedDates.includes(dateStr);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="booking-page">
      <div>
        <br /><br /><br /><br />
      </div>
      <Button onClick={handleClickOpen('paper')}>Create A Reservation</Button>

      <Dialog open={open} onClose={handleClose} scroll={scroll} fullWidth={true}>
        <DialogTitle>Booking Title (Hotel, so on)</DialogTitle>
        <DialogContent>
          <p>Room Name: {props.roomId}</p>
          <p>Room Type: {props.roomType}</p>
          <p>Capacity (max capacity: {props.maxOccupancy}): {newBooking.numberOfGuests}</p>
          <Button onClick={decreaseCapacity} disabled={newBooking.numberOfGuests <= 1}>-</Button>
          <Button onClick={increaseCapacity} disabled={newBooking.numberOfGuests >= props.maxOccupancy}>+</Button>
          
          <p>Price: {newBooking.price}</p>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
              <DatePicker
                label="Check-In Date"
                name="checkInDate"
                onChange={(date) => handleDateChange(date, 'checkInDate')}
                shouldDisableDate={shouldDisableDate}
              />
            </div>
            <div>
              <DatePicker
                label="Check-Out Date"
                name="checkOutDate"
                onChange={(date) => handleDateChange(date, 'checkOutDate')}
                shouldDisableDate={shouldDisableDate} 
              />
            </div>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleBooking}>Book</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default BookingPage;

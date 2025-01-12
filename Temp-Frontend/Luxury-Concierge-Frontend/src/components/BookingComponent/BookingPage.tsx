import { useEffect, useState } from "react";
import "./Bookingform.css";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Booking } from "../../interfaces/Booking";
import axios from "axios";
import { Room } from "../../interfaces/Room";
import dayjs from "dayjs";
import Supplementaries from "../../SupplementaryClass";


function BookingPage(props : Room) {

  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState<DialogProps['scroll']>('paper');
  const [curRoom , setCurRoom] = useState<any[]>([]);
  const [newBooking, setNewBooking] = useState<Booking>({
    bookingId: 0,
    roomId: 0,
    userId: 0,
    checkInDate: "",
    checkOutDate: "",
    price: 0,
    numberOfGuests: 1,
    status: 'Pending'
  })

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleBooking = async () => {
    try {
      const res = await axios.post(`${Supplementaries.serverLink}bookings`, newBooking, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } });
      console.log(res.data);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBooking({
        ...newBooking,
        [name]: value
    });
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

  return (
    <div className="booking-page">
      <div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

      </div>
      <Button onClick={handleClickOpen('paper')}> Create A Reservation </Button>

      <Dialog 
      open={open} 
      onClose={handleClose} 
      scroll={scroll}
      fullWidth={true}>
      <DialogTitle>Booking Title (Hotel, so on)</DialogTitle>
        <DialogContent>
          <p>Room Name: {props.roomName}</p>
          <p>Rooms Type: {props.roomType}</p>
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
              />
            </div>
            <div>
              <DatePicker
                label="Check-Out Date"
                name="checkOutDate"
                onChange={(date) => handleDateChange(date, 'checkOutDate')}
              />
            </div>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleBooking}>Book</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingPage;

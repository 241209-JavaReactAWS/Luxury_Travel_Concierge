import { useEffect, useState } from "react";
import "./Bookingform.css";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Booking } from "../../interfaces/Booking";
import axios from "axios";
import { Room } from "../../interfaces/Room";


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
    price: 0
  })

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <div className="booking-page">
      <div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

      </div>
      <Button onClick={handleClickOpen('paper')}> Find A Reservation </Button>

      <Dialog 
      open={open} 
      onClose={handleClose} 
      scroll={scroll}
      fullWidth={true}>
      <DialogTitle>Booking Title (Hotel, so on)</DialogTitle>
        <DialogContent>
          <p>Room Name: {props.roomName}</p>
          <p>Rooms Available: </p>
          <p>Price: </p>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
              <DatePicker
                label="Check-In Date"
              />
            </div>
            <div>
              <DatePicker
                label="Check-Out Date"
              />
            </div>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingPage;

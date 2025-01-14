import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Room } from '../../interfaces/Room';
import { Box, Button, TextField } from '@mui/material';
import Supplementaries from '../../SupplementaryClass';

interface AddRoomProps {
    hotelId: number;
    onClose: () => void;
    onSave: () => void;
    roomToEdit?: Room | null;
}

function AddRoom({ hotelId, onClose, onSave, roomToEdit }: AddRoomProps) {

    const [pricePerNight, setPricePerNight] = useState<number>(0);
    const [room, setRoom] = useState<Room>({
        roomId: 0,
        roomNumber: 0,
        hotel: hotelId,
        roomType: '',
        maxOccupancy: 0,
        isAvailable: true,
        imageUrl: '',
        status: 'Available',
        price: 0,
    });

    useEffect(() => {
        if (roomToEdit) {
            setRoom(roomToEdit);
        }
    }, [roomToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setRoom((prevRoom) => ({
          ...prevRoom,
          [name]: value,
      }));
    };

    const handleSubmit = async () => {
        try {
            if (roomToEdit) {
                await axios.put(
                    `${Supplementaries.serverLink}room/${hotelId}`,
                    { ...room },
                    { withCredentials: true , headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }}
                );
                alert('Room updated successfully');
                onSave();
            } else {
                await axios.post(`${Supplementaries.serverLink}room/${hotelId}`, { ...room}, { withCredentials: true, headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                } });
                alert('Room added successfully');
                onSave();
            }
            
            onClose();
        } catch (error) {
            console.error('Error saving room:', error);
            alert('An error occurred while saving the room. Please try again.');
        }
    };

    return (
      <div className="popup" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Box
              className="popup-content"
              component="form"
              sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                  backgroundColor: 'white',
                  padding: 3,
                  borderRadius: 2,
                  boxShadow: 3, 
              }}
              noValidate
              autoComplete="off"
          >
              <h3>{roomToEdit ? 'Edit Room' : 'Add Room'}</h3>
              <div>
                  <TextField
                      label="Number"
                      name="roomNumber"
                      value={room.roomNumber}
                      onChange={handleChange}
                      variant="filled"
                  />
              </div>
              <div>
                  <TextField
                      label="Room Type"
                      name="roomType"
                      value={room.roomType}
                      onChange={handleChange}
                      variant="filled"
                  />
              </div>
              <div>
                  <TextField
                      label="Max Occupancy"
                      name="maxOccupancy"
                      type="number"
                      value={room.maxOccupancy}
                      onChange={handleChange}
                      variant="filled"
                  />
              </div>
              <div>
                  <TextField
                      label="Image"
                      name="imageUrl"
                      value={room.imageUrl}
                      onChange={handleChange}
                      variant="filled"
                  />
              </div>
              <div>
                  <TextField
                      label="Price Per Night"
                      name="price"
                      type="number"
                      value={room.price}
                      onChange={handleChange}
                      variant="filled"
                  />
              </div>
              <div style={{alignItems: "center", display:"flex", justifyContent:"center"}}>
                <Button onClick={handleSubmit}>{roomToEdit ? 'Update Room' : 'Add Room'}</Button>
                <Button onClick={onClose} sx={{ color: 'red', '&:hover': { backgroundColor: 'darkred' } }}>Cancel</Button>
              </div>
          </Box>
      </div>
  );
}

export default AddRoom;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Supplementaries from '../../SupplementaryClass';
import { Room } from '../../interfaces/Room';
import AddRoom from './AddRoom';
import { Box, FormControl, InputLabel, Select, MenuItem, Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, SelectChangeEvent, TableCell, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';

function RoomManagement({ hotelId }: { hotelId: number }) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [status, setStatus] = useState('');
    const [showAddRoomPopup, setShowAddRoomPopup] = useState(false);
    const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);

    useEffect(() => {
        fetchRooms();
    }, [hotelId]);

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`${Supplementaries.serverLink}room/${hotelId}`, { withCredentials: true });
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const updateRoomStatus = async (roomId: number, newStatus: string) => {
        try {
            await axios.put(`${Supplementaries.serverLink}room/updateStatus/${roomId}`, null, {
                params: { status: newStatus },
                withCredentials: true,
            });
            alert(`Room status updated to ${newStatus}`);
            fetchRooms();
        } catch (error) {
            console.error('Error updating room status:', error);
        }
    };

    const handleDeleteRoom = async (roomId: number) => {
        const roomToDelete = rooms.find((room) => room.roomId === roomId);

        if (roomToDelete?.status === 'Reserved') {
            alert('This room is reserved and cannot be deleted.');
            return;
        }

        try {
            await axios.delete(`${Supplementaries.serverLink}room/delete/${roomId}`, { withCredentials: true });
            alert('Room deleted successfully');
            fetchRooms();
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    const handleStatusChange = (roomId: number) => (
        event: SelectChangeEvent<string>
    ) => {
        const newStatus = event.target.value;
        const updatedRooms = rooms.map(room => 
            room.roomId === roomId ? { ...room, status: newStatus } : room
        );
        setRooms(updatedRooms);
        updateRoomStatus(roomId, newStatus);  
    };

    return (
        <div>
            <h2>Room Management</h2>

            <Button onClick={() => { setShowAddRoomPopup(true); setRoomToEdit(null); }}>Add Room</Button>

            <h3>Rooms in Hotel</h3>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell >Name</TableCell>
                        <TableCell >Type</TableCell>
                        <TableCell >Price</TableCell>
                        <TableCell >Max Occupancy</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell ></TableCell>
                        <TableCell ></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {rooms
                    .filter((room) => !status || room.status === status)
                    .map((room) => ( 
                        <TableRow 
                            key={room.roomId}
                        >
                            <TableCell component="th" scope="row">
                                <Avatar src={room.imageUrl} 
                                    alt={`Room image of ${room.roomName}`}
                                >
                                    
                                    {room.imageUrl}
                                </Avatar>
                            </TableCell>
                            <TableCell>
                                {room.roomName}
                            </TableCell>
                            <TableCell>
                                {room.roomType}
                            </TableCell>
                            <TableCell>
                                {room.price} 
                            </TableCell>
                            <TableCell>
                                {room.maxOccupancy}
                            </TableCell>
                            <TableCell>
                                <Box sx={{ minWidth: 120 }}>
                                    <FormControl fullWidth>
                                        <Select
                                            labelId={`status-select-label-${room.roomId}`}
                                            id={`status-select-${room.roomId}`}
                                            value={String(room.status)} 
                                            label="Status"
                                            onChange={handleStatusChange(room.roomId)}
                                            disabled={room.status === 'Reserved'}
                                        >
                                            <MenuItem value="Available">Available</MenuItem>
                                            <MenuItem value="Reserved">Reserved</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Tooltip title={room.status === 'Reserved' ? "Cannot edit a reserved room" : ""}>
                                    <span>
                                        <Button
                                            onClick={() => {
                                                setShowAddRoomPopup(true);
                                                setRoomToEdit(room);
                                            }}
                                            disabled={room.status === 'Reserved'}
                                        >
                                            Edit Room
                                        </Button>
                                    </span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                <Tooltip title={room.status === 'Reserved' ? "Cannot delete a reserved room" : ""}>
                                    <span>
                                        <Button
                                            onClick={() => handleDeleteRoom(room.roomId)}
                                            disabled={room.status === 'Reserved'}
                                        >
                                            Delete Room
                                        </Button>
                                    </span>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))} 
                    </TableBody>
                </Table>  
            </TableContainer>


            {showAddRoomPopup && (
                <AddRoom
                    hotelId={hotelId}
                    onClose={() => setShowAddRoomPopup(false)}
                    onSave={fetchRooms}
                    roomToEdit={roomToEdit}
                />
            )}
        </div>
    );
}

export default RoomManagement;
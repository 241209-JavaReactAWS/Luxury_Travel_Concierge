import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { Room } from '../../interfaces/Room'
import { Hotel } from '../../interfaces/Hotel'
import Supplementaries from '../../SupplementaryClass';
import BookingPage from '../BookingComponent/BookingPage';
import BookingDataChart from '../BookingDataChart/BookingDataChart';
import { FormControl, InputLabel, Select, MenuItem, Box, Grid, TextField, Typography, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { Padding } from '@mui/icons-material';
import HotelReviews from '../ReviewComponent/Reviews';

function Rooms() {
    const { hotelId } = useParams();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [hotel, setHotel] = useState<Hotel>();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({ status: '', roomType: '', maxOccupancy: ''});
    const [userId, setUserId] = useState(1);
    const data = {
        hotelId: hotelId,
        userId: userId
    }

    if( hotelId == null) {
        return <p>Hotel ID not found</p>
    }

    useEffect(() => {
        axios.get<Hotel>(`${Supplementaries.serverLink}hotel/${hotelId}`,{withCredentials:true})
        .then((res) => {
        setHotel(res.data);
        })
        .catch((error) => {
            console.error("Error fetching hotel details", error);
        });

        axios.get(`${Supplementaries.serverLink}users/userId`, { withCredentials: true })
        .then((response) => { setUserId(response.data) })
        .catch((error) => { setUserId(-1) })
        
        
        axios.get<Room[]>(`${Supplementaries.serverLink}room/${hotelId}`)
            .then((res) => {
                setRooms(res.data);
            })
            .catch((error) => {
                console.error("Error fetching rooms", error);
            });
    }, [filters, hotelId]);

    const handleFilterChange = (newFilters: any) => {
        setFilters(prevFilters => {
            const updatedFilters = { ...prevFilters, ...newFilters };
            const queryParams = new URLSearchParams(updatedFilters).toString();
            navigate(`?${queryParams}`, { replace: true}); 
            return updatedFilters;
        });
    };

return (
    <div>
        <header>
            {hotel ? (


            <div className="hotel-summary">

                <Card sx={{ display: 'flex', backgroundColor:'whitesmoke' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h3" padding={'10px'}>
                        {hotel.name}
                        </Typography>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ color: 'text.secondary', padding:'20px'}}
                        >
                            {hotel.location}
                        </Typography>
                        </CardContent>
                    </Box>
                    <CardMedia
                        component="img"
                        sx={{ 
                            width: 600, 
                            height: 300,
                            marginLeft: 'auto', 
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                         }}
                        image={hotel.imageUrl}
                        alt="Live from space album cover"
                    />
                    </Card>

            </div>
            ) : (
            <p style={{padding:'30px'}}>Loading hotel details...</p>
            )}
        </header>
    {/* <h1>Rooms for Hotel {hotelId}</h1> */}
    
    <div style={{ marginBottom: '20px' }}>
            <Box
                sx={{
                    marginBottom: '20px',
                    backgroundColor: 'white',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Filter Rooms
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Availability</InputLabel>
                            <Select
                                onChange={(e) => handleFilterChange({ availability: e.target.value })}
                                label="Availability"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="true">Available</MenuItem>
                                <MenuItem value="false">Unavailable</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Room Type</InputLabel>
                            <Select
                                onChange={(e) => handleFilterChange({ roomType: e.target.value })}
                                label="Room Type"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="deluxe">Deluxe</MenuItem>
                                <MenuItem value="standard">Standard</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Capacity"
                            onChange={(e) => handleFilterChange({ capacity: e.target.value })}
                            placeholder="Capacity"
                        />
                    </Grid>
                </Grid>
            </Box>
         {/* Room List */}
        
        <main style={{ display: 'grid',gridTemplateColumns: 'repeat(auto-fill, minmax(650px, 1fr))', paddingLeft:'20px'}}>
            {/* <h2>Rooms Available</h2> */}
            {rooms.length > 0 ? (
                rooms.map(room => (
                    <Card 
                        key={room.roomId} 
                        sx={{ display: 'flex', maxWidth: 650, marginBottom: '20px' }}
                    >
                        <CardMedia
                            component="img"
                            sx={{ width: 300, height: 200 }}
                            image={room.imageUrl}
                            alt={`${room.roomNumber} image`}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '10px' }}>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                {/* <Typography component="div" variant="h5">
                                    {room.roomName}
                                </Typography> */}
                                <Typography
                                    component="div" variant="h5"
                                >
                                    Type: {room.roomType}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    component="div"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Guest: 
                                    {room.maxOccupancy}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    component="div"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    <BookingPage {...room} />
                                </Typography>
                            </CardContent>
                        </Box>
                    </Card>
                ))
            ) : (
                <p>Unfortunately, there are no rooms available for this hotel. Please try again later.</p>
            )}
        
        </main>

    </div>
    <div style={{width:'70%', marginLeft:'auto', marginRight:'auto', marginTop:'50px'}}>
        <HotelReviews hotelId={parseInt(hotelId)} userId={1}/>
    </div>
    </div>
)
}

export default Rooms

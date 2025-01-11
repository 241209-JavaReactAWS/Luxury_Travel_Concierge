import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { Room } from '../../interfaces/Room'
import { Hotel } from '../../interfaces/Hotel'
import Supplementaries from '../../SupplementaryClass';
import BookingPage from '../BookingComponent/BookingPage';
import BookingDataChart from '../BookingDataChart/BookingDataChart';

function Rooms() {
    const { hotelId } = useParams();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [hotel, setHotel] = useState<Hotel>();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({ availability: '', roomType: '', capacity: ''});
    

    useEffect(() => {
        axios.get<Hotel>(`${Supplementaries.serverLink}hotel/${hotelId}`,{withCredentials:true})
        .then((res) => {
        setHotel(res.data);
        })
        .catch((error) => {
            console.error("Error fetching hotel details", error);
        });
        
        
        axios.get<Room[]>(`${Supplementaries.serverLink}room/${hotelId}`)
            .then((res) => {
                setRooms(res.data);
            })
            .catch((error) => {
                console.error("Error fetching rooms", error);
            });
    }, [filters, hotelId]);

    const handleFilterChange = (newFilters: any) => {
        // Update the filters state and sync the URL
        setFilters(prevFilters => {
            const updatedFilters = { ...prevFilters, ...newFilters };
            const queryParams = new URLSearchParams(updatedFilters).toString();
            navigate(`?${queryParams}`, { replace: true}); // This updates the URL without reloading
            return updatedFilters;
        });
    };

return (
    <div>
        <header>
        {hotel ? (
        <div className="hotel-summary">
            <img src={hotel.imageUrl} alt={`${hotel.name} Image`}/>
            <h1>{hotel.name}</h1>
            <p>
            Address: {hotel.location}
            Address: {hotel.location}
            </p>

        </div>
        ) : (
        <p>Loading hotel details...</p>
        )}
    </header>
    <h1>Rooms for Hotel {hotelId}</h1>


    
    <div style={{ marginBottom: '20px' }}>
        <label>
            Availability:
            <select onChange={e => handleFilterChange({ availability: e.target.value })}>
                <option value="">All</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
            </select>
        </label>
        <label>
            Room Type:
            <select onChange={e => handleFilterChange({ roomType: e.target.value })}>
                <option value="">All</option>
                <option value="deluxe">Deluxe</option>
                <option value="standard">Standard</option>
            </select>
        </label>
        <label>
            Capacity:
            <input
                type="number"
                placeholder="Capacity"
                onChange={e => handleFilterChange({ capacity: e.target.value })}
            />
        </label>
         {/* Room List */}
        
        <main>
            <h2>Rooms Available</h2>
        <ul>
                {rooms.length > 0 ? (rooms.map(room => (
                    <li key={room.roomId}>
                        <img src={room.imageUrl} alt={`${room.roomName}`} style={{ width: '200px', height: '150px' }} />
                        <h3>{room.roomName}</h3>
                        <p>Type: {room.roomType}</p>
                        <p>Capacity: {room.maxOccupancy}</p>
                        <p>Status: {room.availability}</p>
                        <p>Booking: <BookingPage {...room} /></p>
                    </li>
                ))
            ) : ( <p> Unforunately, there are no rooms available for this hotel. Please try again later.</p>)}
        </ul>
        </main>
    </div>
            <div id="chart-container" style={{width:'70%', marginTop:'50px', marginLeft:'auto', marginRight:'auto', marginBottom:'50px', backgroundColor:'#f5f5f5', padding:'20px', borderRadius:'10px', border:'1px solid #db9d17'}}>
                <BookingDataChart hotelId={hotelId}/>
            </div>
    </div>
)
}

export default Rooms

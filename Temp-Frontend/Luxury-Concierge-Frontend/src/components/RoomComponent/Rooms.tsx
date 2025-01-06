import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { Room } from '../../interfaces/Room'
import { Hotel } from '../../interfaces/Hotel'


function Rooms() {
    const { hotelId } = useParams<{hotelId: string}>();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [hotel, setHotel] = useState<Hotel>();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({ availability: '', roomType: '', capacity: ''});

    useEffect(() => {
        const queryParams = new URLSearchParams(filters).toString();
        const url = `http://localhost:8080/hotel/${hotelId}/rooms?${queryParams}`;

        axios.get<Hotel>(`http://localhost:8080/hotel/${hotelId}`)
        .then((res) => {
        setHotel(res.data);
        })
        .catch((error) => {
    console.error("Error fetching hotel details", error);
        });
        axios.get<Room[]>(url)
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
            navigate(`?${queryParams}`, { replace: true }); // This updates the URL without reloading
            return updatedFilters;
        });
    };

return (
    <div>
        <header>
        {hotel ? (
        <div className="hotel-summary">
            <img src={hotel.hotelImage} alt={`${hotel.hotelName} Image`} />
            <h1>{hotel.hotelName}</h1>
            <p>
            Address: {hotel.hotelStreet}, {hotel.hotelCity}, {hotel.hotelState} {hotel.hotelZipcode}
            </p>
            <p>Phone: {hotel.hotelPhoneNumber}</p>
            <p>Email: {hotel.hotelEmail}</p>
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
                        <img src={room.roomImage} alt={`${room.roomName}`} style={{ width: '200px', height: '150px' }} />
                        <h3>{room.roomName}</h3>
                        <p>Type: {room.roomType}</p>
                        <p>Capacity: {room.capacity}</p>
                        <p>Status: {room.availability}</p>
                    </li>
                ))
            ) : ( <p> Unforunately, there are no rooms available for this hotel. Please try again later.</p>)}
        </ul>
        </main>
    </div>
    </div>
)
}

export default Rooms

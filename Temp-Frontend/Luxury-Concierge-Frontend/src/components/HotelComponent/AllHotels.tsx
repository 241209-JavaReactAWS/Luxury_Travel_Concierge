import React from 'react'
import { useEffect, useState } from 'react';
import { Hotel } from '../../interfaces/Hotel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function AllHotels() {
    const [allHotels,setAllHotels]=useState<Hotel[]>([])
    const [favorites, setFavorites] = useState<Hotel[]>([])
    const navigate = useNavigate()

    useEffect(()=>{
        axios.get<Hotel[]>("http://localhost:8080/hotels")
            .then((res)=>{
                setAllHotels(res.data)
            })
            .catch((error)=>{
                console.error("Error fetching Hotels", error)
            })
    },[])

    useEffect(() => {
        axios.get<Hotel[]>('http://localhost:8080/User/favorites', { withCredentials: true })
          .then((res) => {
            setFavorites(res.data); 
          })
          .catch((err) => {
            console.error('Error fetching favorites:', err);
          });
      }, []);


  return (
    <div>
        <h3>AllHotels Component Loaded</h3>
        <div>
            <h3>Your Favorite Hotels</h3>
            <ul>
                {favorites.map((hotel) => (
                    <li key={hotel.hotelId}>{hotel.hotelName}</li> 
                ))}
            </ul>
        </div>
        <header>
            search hotels on location- city and state
        </header>
        <main>
            <ul>
                {allHotels.map((hotel)=>{
                    return(
                        <li>
                            {hotel.hotelImage}
                            {hotel.hotelName}
                            Address: {hotel.hotelStreet},
                            {hotel.hotelCity}, {hotel.hotelState}, {hotel.hotelZipcode}
                            {/* Owned By {hotel.owner} */}
                            <button onClick={() => navigate(`/hotels/${hotel.hotelId}`)}>
                                    Click for More 
                            </button>
                        </li>
                    )})}
            </ul>
        </main>
    </div>
  )
}

export default AllHotels
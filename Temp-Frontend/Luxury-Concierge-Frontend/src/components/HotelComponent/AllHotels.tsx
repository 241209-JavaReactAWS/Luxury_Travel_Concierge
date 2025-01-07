import React from 'react'
import { useEffect, useState } from 'react';
import { Hotel } from '../../interfaces/Hotel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import NavigateNext from '@mui/icons-material/NavigateNext';
import NavigateBefore from '@mui/icons-material/NavigateBefore';
import FavoriteIcon from '@mui/icons-material/Favorite';


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
        <Box sx={{ padding: 4 }}>
        <Carousel
            NextIcon={<NavigateNext />} 
            PrevIcon={<NavigateBefore />}
        >
            {favorites.map((hotel) => ( 
                <Card sx={{ maxWidth: 300 }} key={hotel.hotelId} >
                    <CardActionArea>
                    <FavoriteIcon 
                        color="disabled"
                        sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8
                        }}
                    />
                    {/* disabled" | "action" | "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" */}
                    <CardMedia
                    component="img"
                    height="150"
                    image={hotel.imageUrl}
                    alt="green iguana"
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {hotel.hotelName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Location: {hotel.location}
                    </Typography>
                    </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary">
                        More Info
                        </Button>
                    </CardActions>
                </Card>
            ))}

        </Carousel>
        </Box>
        <header>
            search hotels on location- city and state
        </header>
        <main>
                {allHotels.map((hotel)=>{
                    return(
                        <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea>
                            <CardMedia
                            component="img"
                            height="140"
                            image="/static/images/cards/contemplative-reptile.jpg"
                            alt="green iguana"
                            />
                            <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Lizard
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Lizards are a widespread group of squamate reptiles, with over 6,000
                                species, ranging across all continents except Antarctica
                            </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button 
                                size="small" 
                                color="primary" 
                                onClick={() => navigate(`/hotels/${hotel.hotelId}`)}
                            >
                            More Info
                            </Button>
                        </CardActions>
                        </Card>
                    )})}
        </main>
    </div>
  )
}

export default AllHotels
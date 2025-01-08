import React from 'react'
import { useEffect, useState } from 'react';
import { Hotel } from '../../interfaces/Hotel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Divider, IconButton, InputBase, Paper, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import NavigateNext from '@mui/icons-material/NavigateNext';
import NavigateBefore from '@mui/icons-material/NavigateBefore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';


function AllHotels() {
    const [allHotels,setAllHotels]=useState<Hotel[]>([])
    const [favorites, setFavorites] = useState<Hotel[]>([])
    const navigate = useNavigate()
    const [searchName, setSearchName] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

    useEffect(()=>{
        axios.get<Hotel[]>("http://localhost:8080/hotels")
            .then((res)=>{
                setAllHotels(res.data)
                setFilteredHotels(res.data);
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

      const handleSearch = () => {
        const filtered = allHotels.filter(
          (hotel) =>
            hotel.hotelName.toLowerCase().includes(searchName.toLowerCase()) &&
            hotel.location.toLowerCase().includes(searchLocation.toLowerCase())
        );
        setFilteredHotels(filtered);
      };


      const handleFavorite = (hotel: Hotel) => {
        if (favorites.some((fav) => fav.hotelId === hotel.hotelId)) {
            setFavorites(favorites.filter((fav) => fav.hotelId !== hotel.hotelId));
        } else {
            setFavorites([...favorites, hotel]);
        }
    };

    const isFavorite = (hotelId: number) => {
        return favorites.some((fav) => fav.hotelId === hotelId);
    };



  return (
    <div>
        {favorites.length > 0 && ( 
                <Box sx={{ padding: 4, paddingRight: 7, paddingLeft: 7 }}>
                    <Carousel NextIcon={<NavigateNext />} PrevIcon={<NavigateBefore />}>
                        {favorites.map((hotel) => (
                            <Card sx={{ maxWidth: 300 }} 
                                key={hotel.hotelId}
                                >
                                <CardActionArea>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        p: 1,
                                    }}
                                >
                                    <FavoriteIcon
                                        color="disabled"
                                        // "disabled" | "action" | "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning", SvgIconPropsColorOverrides
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.2)',
                                            },
                                        }}
                                    />
                                </Box>
                                    <CardMedia
                                        component="img"
                                        height="150"
                                        image={hotel.imageUrl}
                                        alt={hotel.hotelName}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            Name:{hotel.hotelName}
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
            )}
        <header>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 10px',
                    backgroundColor: 'white',
                }}
            >
                {/* <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                    Search for Your Next Stay
                </Typography> */}
                <Paper
                    component="form"
                    sx={{
                        p: '10px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: 600,
                        borderRadius: '25px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.2)',
                        },
                    }}
                >
                    <InputBase
                        sx={{
                            ml: 1,
                            flex: 1,
                            fontSize: '16px',
                            borderRadius: '12px',
                            backgroundColor: '#f0f0f0',
                            padding: '10px',
                        }}
                        placeholder="Search by Hotel Name"
                        inputProps={{ 'aria-label': 'search by hotel name' }}
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <InputBase
                        sx={{
                            ml: 1,
                            flex: 1,
                            fontSize: '16px',
                            borderRadius: '12px',
                            backgroundColor: '#f0f0f0',
                            padding: '10px',
                            mr: 2,
                        }}
                        placeholder="Where to"
                        inputProps={{ 'aria-label': 'search by location' }}
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                    />
                    <IconButton
                        type="button"
                        sx={{
                            p: '10px', 
                            backgroundColor: 'FireBrick', 
                            borderRadius: '50%', 
                            color: 'white', 
                            '&:hover': {
                            backgroundColor: 'darkred'
                            },
                        }}
                        aria-label="search"
                        >
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </Box>
        </header>
        <main style={{ padding: "30px", display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {allHotels.map((hotel)=>{ 
                    return(  
                        <Card 
                            sx={{
                                maxWidth: 345,
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                transition: 'box-shadow 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                },
                            }}    
                        >
                        <CardActionArea>
                        {!isFavorite(hotel.hotelId) && ( 
                                <Box 
                                    sx={{ 
                                        position: 'absolute', 
                                        top: 8, 
                                        right: 8, 
                                        padding: '4px' 
                                    }}
                                >
                                    <FavoriteBorderIcon
                                        color="disabled"
                                        onClick={() => handleFavorite(hotel)}
                                        sx={{ 
                                            cursor: 'pointer', 
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.2)',
                                            },
                                        }}
                                        
                                    />
                                </Box>
                            )}
                            <CardMedia
                            component="img"
                            height="170"
                            image={hotel.imageUrl}
                            alt="green iguana"
                            />
                            <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Name:{hotel.hotelName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Location: {hotel.location} 
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
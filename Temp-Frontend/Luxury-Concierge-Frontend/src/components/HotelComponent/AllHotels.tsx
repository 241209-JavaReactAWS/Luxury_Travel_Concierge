import React from 'react'
import { useEffect, useState } from 'react';
import { Hotel } from '../../interfaces/Hotel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Divider, Grid, IconButton, InputAdornment, InputBase, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import NavigateNext from '@mui/icons-material/NavigateNext';
import NavigateBefore from '@mui/icons-material/NavigateBefore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import Supplementaries from '../../SupplementaryClass';
import Fuse from 'fuse.js';

function AllHotels() {
    const [allHotels,setAllHotels]=useState<Hotel[]>([])
    const [favorites, setFavorites] = useState<Hotel[]>([])
    const navigate = useNavigate()
    const [searchName, setSearchName] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    // const [popularLocations, setPopularLocations] = useState(['New York', 'Paris', 'London', 'Tokyo', 'Dubai']);

    const fuseOptions = {
        keys: ['name', 'location'], 
        threshold: 0.3, 
    };

    useEffect(()=>{
        axios.get<Hotel[]>(Supplementaries.serverLink + "hotel",{ withCredentials:true, headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }})
            .then((res)=>{
                console.log(res.data);
                setAllHotels(res.data)
                setFilteredHotels(res.data);
            })
            .catch((error)=>{
                console.error("Error fetching Hotels", error)
            })
    },[])

    const handleSearch = () => {
        const fuse = new Fuse(allHotels, fuseOptions);
        const results = fuse.search(searchName || searchLocation);
        const filteredResults = results.map((result) => result.item);
    
        const finalResults = filteredResults.filter((hotel) => {
            const matchesPrice =
                hotel.rooms &&
                Array.isArray(hotel.rooms) &&
                hotel.rooms.length > 0 &&
                hotel.rooms.some((room) => {
                    const roomPrice = room.price;
                    return (
                        (minPrice ? roomPrice >= minPrice : true) &&
                        (maxPrice ? roomPrice <= maxPrice : true)
                    );
                });
                return matchesPrice;
            });
    
            setFilteredHotels(finalResults.length > 0 ? finalResults : allHotels); 
        };

    useEffect(() => {
        axios.get<Hotel[]>(Supplementaries.serverLink + 'users/favorites', { withCredentials:true, headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                } })
          .then((res) => {
            setFavorites(res.data); 
          })
          .catch((err) => {
            console.error('Error fetching favorites:', err);
          });
      }, []);

      const handleAddFavorite = (hotelId: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }
    
        const newHotel = allHotels.find((hotel) => hotel.hotelId === hotelId);
        if (newHotel) {
            setFavorites((prevFavorites) => [...prevFavorites, newHotel]);
        }
    
        axios
            .post(`${Supplementaries.serverLink}users/favorites/${hotelId}`, {}, {  
                withCredentials: true, 
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log('Hotel added to favorites:', response.data);
            })
            .catch((err) => {
                console.error("Error adding hotel to favorites:", err);
                if (err.response) {
                    console.error("Response Data:", err.response.data);
                    console.error("Status Code:", err.response.status);
                    console.error("Headers:", err.response.headers);
                } else {
                    console.error("Error Message:", err.message);
                }
    
                setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.hotelId !== hotelId));
            });
    };
    
    
    

    const isFavorite = (hotelId: number) => {
        return favorites.some((fav) => fav.hotelId === hotelId);
    };

    const handleRemoveFromFavorites = (hotelId: number) => {
        axios
            .delete(`${Supplementaries.serverLink}users/favorites/${hotelId}`, { withCredentials:true, headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                } })
            .then(() => {
                setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.hotelId !== hotelId));
            })
            .catch((err) => {
                console.error("Error removing hotel from favorites:", err);
                if (err.response) {
                    console.error("Response Data:", err.response.data);
                    console.error("Status Code:", err.response.status);
                    console.error("Headers:", err.response.headers);
                }
            });
    };

    const groupIntoChunks = (array: any[], chunkSize: number) => {
        const result= [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    const FavoritesCarousel: React.FC<{ 
        favorites: any[]; handleRemoveFromFavorites: any; navigate: any }> = ({ 
            favorites, handleRemoveFromFavorites, navigate }) => {

        const [activeStep, setActiveStep] = useState(0);
        const chunkSize = 4; 
        const maxSteps = Math.ceil(favorites.length / chunkSize);

        const handleNext = () => {
            if (activeStep < maxSteps - 1) {
                setActiveStep(activeStep + 1);
            }
        };

        const handleBack = () => {
            if (activeStep > 0) {
                setActiveStep(activeStep - 1);
            }
        };

        return (
            <Box sx={{ padding: 4, paddingRight: 7, paddingLeft: 7 }}>
                {favorites.length > 0 && (
                    <Carousel
                        NextIcon={<NavigateNext />}
                        PrevIcon={<NavigateBefore />}
                        indicatorIconButtonProps={{ style: { display: 'none' } }}
                        navButtonsAlwaysVisible={true}
                        sx={{

                            gap: 2,
                            width: '100%',
                            overflow: 'hidden',
                        }}
                        autoPlay={false}
                        interval={3000}
                        navButtonsAlwaysInvisible={false}
                        navButtonsProps={{
                            style: { color: 'white' }
                        }}
                        animation="slide"
                    >
                        {groupIntoChunks(favorites, chunkSize).map((group, groupIndex) => (
                            <Box key={groupIndex} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                {group.map((hotel: Hotel) => (
                                    <Card sx={{ maxWidth: 300, flex: 1 }} key={hotel.hotelId}>
                                        <CardActionArea>
                                            <Box sx={{ position: 'absolute', top: 8, right: 8, p: 1 }}>
                                                <FavoriteIcon
                                                    color="warning"
                                                    onClick={() => handleRemoveFromFavorites(hotel.hotelId)}
                                                    sx={{ cursor: 'pointer', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.2)' } }}
                                                />
                                            </Box>
                                            <CardMedia component="img" height="150" image={hotel.imageUrl} alt={hotel.name} />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {hotel.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {hotel.location}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                        <CardActions>
                                            <Button size="small" color="primary" onClick={() => navigate(`/hotels/${hotel.hotelId}`)}>
                                                More Info
                                            </Button>
                                        </CardActions>
                                    </Card>
                                ))}
                            </Box>
                        ))}
                    </Carousel>
                )}
            </Box>
        );
    };

    return (
        <div>
            <FavoritesCarousel
                favorites={favorites}
                handleRemoveFromFavorites={handleRemoveFromFavorites}
                navigate={navigate}
            />

        <header>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 10px',
                    backgroundColor: 'white',
                    width: '100%',
                }}
            >
                <Paper
                    component="form"
                    sx={{
                        p: '10px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent:'center',
                        width: '100%',
                        maxWidth: 900, 
                        borderRadius: '25px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.2)',
                        },
                    }}
                >
                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        <Grid item xs={12} sm={3}>  
                            <InputBase
                                sx={{
                                    width: '100%',
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
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <InputBase
                                sx={{
                                    width: '100%',
                                    fontSize: '16px',
                                    borderRadius: '12px',
                                    backgroundColor: '#f0f0f0',
                                    padding: '10px',
                                }}
                                placeholder="Where to"
                                inputProps={{ 'aria-label': 'search by location' }}
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={6} sm={2}>
                            <InputBase
                                sx={{
                                    width: '100%',
                                    fontSize: '16px',
                                    borderRadius: '12px',
                                    backgroundColor: '#f0f0f0',
                                    padding: '10px',
                                }}
                                placeholder="Min Price"
                                inputProps={{ 'aria-label': 'search by min price' }}
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            />
                        </Grid>

                        <Grid item xs={6} sm={2}>
                            <InputBase
                                sx={{
                                    width: '100%',
                                    fontSize: '16px',
                                    borderRadius: '12px',
                                    backgroundColor: '#f0f0f0',
                                    padding: '10px',
                                }}
                                placeholder="Max Price"
                                inputProps={{ 'aria-label': 'search by max price' }}
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            />
                        </Grid>

                        <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton
                                type="button"
                                onClick={handleSearch}
                                sx={{
                                    p: '10px',
                                    backgroundColor: 'lightgrey',
                                    borderRadius: '50%',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'grey',
                                    },
                                    width: '50px', 
                                    height: '50px',
                                }}
                                aria-label="search"
                            >
                                <SearchIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Paper>

            </Box>
        </header>


        <main style={{ padding: "30px", display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {filteredHotels.map((hotel) => (
                        <Card 
                            key={hotel.hotelId}
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
                                        color="warning"
                                        onClick={() => handleAddFavorite(hotel.hotelId)}
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
                                {hotel.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {hotel.location} 
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
                    ))} 
        </main>
    </div>
  )
}

export default AllHotels
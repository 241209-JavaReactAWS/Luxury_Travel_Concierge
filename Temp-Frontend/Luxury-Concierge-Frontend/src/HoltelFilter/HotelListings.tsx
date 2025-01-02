import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';

interface Hotel {
  id: number;
  name: string;
  location: string;
  room: string;
  rating: number;
}

const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get('http://localhost:8080/hotels');
        setHotels(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Stack direction="row" spacing={3} flexWrap="wrap">
        {hotels.map((hotel) => (
          <Box
            key={hotel.id}
            sx={{
              width: {
                xs: '100%',
                sm: '48%', 
                md: '30%', 
              },
              marginBottom: 3,
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h5">{hotel.name}</Typography>
                <Typography variant="body2">Rating: {hotel.rating} / 5</Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default HotelList;
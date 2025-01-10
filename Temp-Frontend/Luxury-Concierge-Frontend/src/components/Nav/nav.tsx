import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { AppBar, Box, Button, Container, Divider, Menu, MenuItem, Toolbar, Typography } from "@mui/material";


export default function nav() {
    const navigate = useNavigate();

    //State for the dropdown menu
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    let navToPage = (location: string) => {
        navigate(location)
        handleMenuClose();
    }

    return (
        <AppBar position="sticky">
            <Container>
                <Toolbar>
                    {/* button for the dropdown menu */}
                    <Button color="inherit" onClick={handleMenuClick}>
                        Menu
                    </Button>

                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Luxury Concierge
                    </Typography>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}>
                        <MenuItem onClick={() => navToPage('/')}>Login</MenuItem>

                        <Divider orientation="horizontal" flexItem sx={{ mx: 2, borderWidth: 2 }} />

                        <MenuItem onClick={() => navToPage('/Hotels')}>Hotels Listing</MenuItem>

                        <Divider orientation="horizontal" flexItem sx={{ mx: 2, borderWidth: 2 }} />

                        <MenuItem onClick={() => navToPage('/UserRegistration')}>New Account</MenuItem>

                        <Divider orientation="horizontal" flexItem sx={{ mx: 2, borderWidth: 2 }} />

                        <MenuItem onClick={() => navToPage('/test')}>Admin Stats</MenuItem>
                        
                        <Divider orientation="horizontal" flexItem sx={{ mx: 2, borderWidth: 2 }} />

                        <MenuItem onClick={() => navToPage('/reviews')}>Reviews</MenuItem>

                        <Divider orientation="horizontal" flexItem sx={{ mx: 2, borderWidth: 2 }} />

                        <MenuItem onClick={() => navToPage('/payment')}>Payment</MenuItem>

                    </Menu>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
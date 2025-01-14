import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { AppBar, Box, Button, Container, Divider, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import Supplementaries from "../../SupplementaryClass";
import { color } from "chart.js/helpers";


export default function nav() {
    const navigate = useNavigate();
    const [role, setRole] = useState<string>("");

    useEffect(() => {
        axios.get(Supplementaries.serverLink + "users/user", { withCredentials:true, headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                } })
        .then((response) => {
            setRole(response.data)
        }).catch((error) => {
            setRole("")
        })
    });
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

    let logout = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    return (
        <AppBar position="sticky"  style={{backgroundColor:"Navy"}}>
            <Container>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    {/* button for the dropdown menu */}
                    <Button color="inherit" onClick={handleMenuClick}
                        
                    >
                        Menu
                    </Button>

                    <Typography variant="h6" sx={{ alignItems:"flex-end" }}>
                        LuxuryConcierge
                    </Typography>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}>
                        {/* <MenuItem onClick={() => navToPage('/')}>Home</MenuItem>

                        <Divider orientation="horizontal" flexItem sx={{ mx: 2, borderWidth: 2 }} /> */}
                        
                        {role == "" ? <MenuItem onClick={() => navToPage('/UserRegistration')}>New Account</MenuItem> : <></>}

                        {role == "" ? <Divider orientation="horizontal" flexItem sx={{ mx: 2, borderWidth: 2 }} /> : <></>}
                        
                        {role == "CUSTOMER" ? <MenuItem onClick={() => navToPage('/BookingList')}>My Bookings</MenuItem> : <></>}

                        {role != "" ? <Divider orientation="horizontal" flexItem sx={{ mx: 2, borderWidth: 2 }} /> : <></>}
                                                
                        {role != "" ? <MenuItem onClick={() => navToPage('/Hotels')}>Hotels Listing</MenuItem> : <></>}

                        {role == "ADMIN" ? <Divider orientation="horizontal" flexItem sx={{ mx: 2, borderWidth: 2 }} /> : <></>}

                        {role == "ADMIN" ?<MenuItem onClick={() => navToPage('/HotelManagement')}>Manage Hotels</MenuItem> : <></>}
                        
                        {role == "ADMIN" ?<Divider orientation="horizontal" flexItem sx={{ mx: 2, borderWidth: 2 }} /> : <></>}

                        {role == "ADMIN" ?<MenuItem onClick={() => navToPage('/bookingAdmin')}>Booking Admin</MenuItem>:<></>}

                        {role != "" ?<Divider orientation="horizontal" flexItem sx={{ mx: 2, borderWidth: 2 }} />:<></>}

                        {role != "" ? <MenuItem onClick={() => logout()}>LogOut</MenuItem>: <></>}

                    </Menu>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
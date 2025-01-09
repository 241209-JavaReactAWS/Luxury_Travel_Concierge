import React from 'react'
import { Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Supplementaries from '../../SupplementaryClass';

function nav() {
  function navToPage(arg0: string): void {
    window.location.href = arg0;
  }

  return (
    <> 

      <AppBar component="nav" sx={{ background: "WhiteSmoke" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: "block", sm: "block" }, cursor: "pointer", color: "black" }}
            onClick={() => navToPage(Supplementaries.clientLink)}
          >
            Luxury Concierge
          </Typography>

          {/* Right-aligned Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              alignItems: "center",
              flexWrap: "wrap",
              maxWidth: "100%",
              paddingRight: "50px"
            }}
          >
            <Button variant="contained" color="secondary" 
              sx={{ color: "black", background: "rgba(0, 0, 0, 0.1)" }} 
              onClick={() => navToPage(Supplementaries.clientLink + "/userRegistration")}>
              Sign Up
            </Button>
          </Box>

        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  )
}

export default nav
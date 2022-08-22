import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate
} from "react-router-dom";
import Location from './Locations';
import Buses from './Buses';
import Users from './Users';
import BusRoute from './BusRoute';
import Driver from './Driver';

const drawerWidth = 240;

function Home(props) {

  const [items, setItems] = useState({});

  useEffect(() => {
    const userRole = JSON.parse(localStorage.getItem('user'));
    if (userRole) {
     setItems(userRole);
     console.log('-------->',userRole.Role)
    }
  }, []);

  const navigatelogin = () => {
  localStorage.clear()
  props.loginHandler(false)
  
};

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Bus Tracking
          </Typography>
          <Button color="inherit" onClick={navigatelogin} >Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        {items.Role == 'Admin'? 
        <List>
            <NavLink to={"locations"} style={{
                textDecoration : 'none' , 
                color : 'black' , 
              }}>
            <ListItem key={"Locations"} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary={"Locations"} />
              </ListItemButton>
            </ListItem>
            </NavLink>
            <NavLink to={"buses"} style={{
                textDecoration : 'none' , 
                color : 'black' , 
              }}>
              <ListItem key={"Buses"} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Buses"} />
                </ListItemButton>
              </ListItem>
            </NavLink>
            <NavLink to={"users"} isA style={{
                textDecoration : 'none' , 
                color : 'black' , 
              }}>
              <ListItem key={"Users"} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Users"} />
                </ListItemButton>
              </ListItem>
            </NavLink>
            <NavLink to={"routes"} style={{
                textDecoration : 'none' , 
                color : 'black' , 
              }}>
              <ListItem key={"BusRoute"} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Route"} />
                </ListItemButton>
              </ListItem>
            </NavLink>


        </List>
          :    
        <List>
            <NavLink to={"drivers"} style={{
                textDecoration : 'none' , 
                color : 'black' , 
              }}>
              <ListItem key={"Driver"} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Driver"} />
                </ListItemButton>
              </ListItem>
            </NavLink>


        </List>      
        }

      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Routes>
        {items.Role == 'Admin'?
        <>
         <Route path="/locations" element={<Location />} />
          <Route path="/buses" element={<Buses />} />
          <Route path="/users" element={<Users />} />
          <Route path="/routes" element={<BusRoute />} />
          <Route path="*" element={<BusRoute />} />
        </> 
          :
          <>
            <Route path="/drivers" element={<Driver />} />
            <Route path="*" element={<Driver />} />
          </>
      }
        </Routes>
      </Box>
    </Box>
  );
}


export default Home
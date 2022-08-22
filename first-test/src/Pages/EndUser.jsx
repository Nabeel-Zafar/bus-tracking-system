import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import axios from '../services/axiosInterceptor';
import { Alert, AlertTitle } from '@mui/lab';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';



function renderTimeAndStop({Name, EstimatedTime, ActualTime}){
  return `${Name} - Est Time ${(EstimatedTime && new Date(EstimatedTime).toLocaleString()) || "N/A"} - Actual Time ${(ActualTime && new Date(ActualTime).toLocaleString())  || "N/A"}`
}

let tableColumns = [
  { title: 'Bus Name', field: 'BusName', lookup: {}, render: rowData => rowData.Bus && rowData.Bus.Name },
  { title: 'Current Location', field: 'Name', lookup: {},  render: rowData => rowData.Driver && rowData.CurrentLocation },
  { title: 'Stop 1', field: 'Stop1', lookup: {}, render: rowData => rowData.Stop1 && renderTimeAndStop(rowData.Stop1) },
  { title: 'Stop 2', field: 'Stop2', lookup: {}, render: rowData => rowData.Stop2 && renderTimeAndStop(rowData.Stop2) },
  { title: 'Stop 3', field: 'Stop3', lookup: {}, render: rowData => rowData.Stop3 &&  renderTimeAndStop(rowData.Stop3)},
]

const BusRoute = () => {

  const [routes, setRoutes] = useState([]);
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [buses, setBuses] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [columns, setColumns] = useState([...tableColumns])


  useEffect(() => {
      axios.get(`/api/getPublicRoutes`)
      .then(res => {
        const locations = res.data?.data.map(x => {
          let route = {...x};
          if(route.Stop1 &&  !route.Stop1.ActualTime){
            route.CurrentLocation = route.Stop1.Name
          }
          else 
          if(route.Stop2 &&  !route.Stop2.ActualTime){
            route.CurrentLocation = route.Stop2.Name
          }
          else if(route.Stop3 && !route.Stop3.ActualTime ){
            route.CurrentLocation = route.Stop3.Name
          }else {
            route.CurrentLocation = "--"
          }
          return route;
        });
        setLocations(locations);
      })
  }, [])


  return (
    <div className="app">
      <Box sx={{ flexGrow: 1 }} style={{ marginBottom:'50px' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bus Tracking
          </Typography>
          
        </Toolbar>
      </AppBar>
    </Box>
      <center><MaterialTable
       style={{ width:'90%' }}
        title="Buses Status"
        columns={columns}
        data={locations}
        options={{
          headerStyle: { borderBottomColor: 'red', borderBottomWidth: '3px', fontFamily: 'verdana' },
          actionsColumnIndex: -1
        }}
        
      />
      </center>
      <div>
        {iserror &&
          <Alert severity="error">
            <AlertTitle>ERROR</AlertTitle>
            {errorMessages.map((msg, i) => {
              return <div key={i}>{msg}</div>
            })}
          </Alert>
        }
      </div>

    </div>
  );
}

export default BusRoute;
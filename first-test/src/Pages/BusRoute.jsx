import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import axios from '../services/axiosInterceptor';
import { Alert, AlertTitle } from '@mui/lab';



let tableColumns = [
  { title: 'Bus Name', field: 'BusName', lookup: {}, render: rowData => rowData.Bus.Name },
  { title: 'Driver Name', field: 'Name', lookup: {},  render: rowData => rowData.Driver.Name },
  { title: 'Stop 1', field: 'Stop1', lookup: {}, render: rowData => rowData.Stop1?.Name },
  { title: 'Stop 2', field: 'Stop2', lookup: {}, render: rowData => rowData.Stop2?.Name },
  { title: 'Stop 3', field: 'Stop3', lookup: {}, render: rowData => rowData.Stop3?.Name },
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
    axios.get(`/api/getAllRoutes`)
      .then(res => {
        setRoutes(res.data);
        // console.log(users);
      })
      axios.get(`/api/getAllBuses`)
      .then(res => {
        const buses = res.data.map(x => ({[x._id]: x.BusName}));
        setBuses(res.data);
        let columnsUpdate = [...columns];
        columns[0].lookup = Object.assign({}, ...buses);
        setColumns(columnsUpdate);
        // console.log(users);
      })
      axios.get(`/api/getAllUsers`)
      .then(res => {
        const users = res.data?.filter(x => x.Role === "Driver").map(x => ({[x._id]: x.Name}));
        setUsers( res.data);
        let columnsUpdate = [...columns];
        columns[1].lookup = Object.assign({}, ...users);
        setColumns(columnsUpdate);
        // console.log(users);
      })
      axios.get(`api/getAllLocations`)
      .then(res => {
        const locations = res.data.map(x => ({[x._id]: x.LocationName}));
        setLocations(res.data);
        let columnsUpdate = [...columns];
        columns[2].lookup = Object.assign({}, ...locations);
        columns[3].lookup = Object.assign({}, ...locations);
        columns[4].lookup = Object.assign({}, ...locations);
        setColumns(columnsUpdate);
      })
  }, [])



  //function for updating the existing row details
  const handleRowUpdate = (newData, oldData, resolve) => {
    //validating the data inputs
    let errorList = [];
    // debugger
    if (newData.BusName === "") {
      errorList.push("Oops!!! You didn't enter the Bus Name field")
    }
    if (newData.Name === "") {
      errorList.push("Oops!!! You didn't enter the Driver field")
    }
    if (newData.Stop1 === "" || newData.Stop1 == newData.Stop2 || newData.Stop1 == newData.Stop3) {
      errorList.push("Oops!!! Please enter a valid Stop 1, You cannot add same stop in all stops")
    }
    if (newData.Stop2 === "" || newData.Stop2 == newData.Stop1 || newData.Stop2 == newData.Stop3) {
      errorList.push("Oops!!! Please enter a valid Stop 2, You cannot add same stop in all stops")
    }
    if (newData.Stop3 === "" || newData.Stop3 == newData.Stop1 || newData.Stop3 == newData.Stop2) {
      errorList.push("Oops!!! Please enter a valid Stop 2, You cannot add same stop in all stops")
    }

    if (errorList.length < 1) {
      let sendData = {}
      let bus = buses.find(x => x._id === newData.BusName);
      let Driver = users.find(x => x._id === newData.Name);
      let stop1 = locations.find(x => x._id === newData.BusName);
      let stop2 = locations.find(x => x._id === newData.BusName);
      let stop3 = locations.find(x => x._id === newData.BusName);
      sendData.Bus = {
        ID: bus._id,
        Name: bus.BusName
      }
      sendData.Driver = {
        ID: Driver._id,
        Name: Driver.Name
      }
      sendData.Stop1 = {
        ID: stop1._id,
        Name: stop1.LocationName
      }
      sendData.Stop2 = {
        ID: stop2._id,
        Name: stop2.LocationName
      }
      sendData.Stop3 = {
        ID: stop3._id,
        Name: stop3.LocationName
      }
      axios.put(`/api/updateRoute/${newData.id}`, sendData)
        .then(response => {
          const routesData = [...routes];
          const index = oldData.tableData.id;
          routesData[index] = newData;
          setRoutes([...routesData]);
          resolve()
          setIserror(false)
          setErrorMessages([])
        })
        .catch(error => {
          setErrorMessages(["Update failed! Server error"])
          setIserror(true)
          resolve()

        })
    } else {
      setErrorMessages(errorList)
      setIserror(true)
      resolve()

    }
  }


  //function for deleting a row
  const handleRowDelete = (oldData, resolve) => {
    axios.delete(`/api/deleteRoute/${routes[oldData.tableData.id]._id}`)
      .then(response => {
        const dataDelete = [...routes];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setRoutes([...dataDelete]);
        resolve()
      })
      .catch(error => {
        setErrorMessages(["Delete failed! Server error"])
        setIserror(true)
        resolve()
      })
  }


  //function for adding a new row to the table
  const handleRowAdd = (newData, resolve) => {
    //validating the data inputs
    let errorList = []
    // debugger
    if (newData.BusName === "") {
      errorList.push("Oops!!! You didn't enter the Bus Name field")
    }
    if (newData.Name === "") {
      errorList.push("Oops!!! You didn't enter the Driver field")
    }
    if (newData.Stop1 === "" || newData.Stop1 == newData.Stop2 || newData.Stop1 == newData.Stop3) {
      errorList.push("Oops!!! Please enter a valid Stop 1, You cannot add same stop in all stops")
    }
    if (newData.Stop2 === "" || newData.Stop2 == newData.Stop1 || newData.Stop2 == newData.Stop3) {
      errorList.push("Oops!!! Please enter a valid Stop 2, You cannot add same stop in all stops")
    }
    if (newData.Stop3 === "" || newData.Stop3 == newData.Stop1 || newData.Stop3 == newData.Stop2) {
      errorList.push("Oops!!! Please enter a valid Stop 3, You cannot add same stop in all stops")
    }

    let sendData = {}
    let bus = buses.find(x => x._id === newData.BusName);
    let Driver = users.find(x => x._id === newData.Name);
    let stop1 = locations.find(x => x._id === newData.Stop1);
    let stop2 = locations.find(x => x._id === newData.Stop2);
    let stop3 = locations.find(x => x._id === newData.Stop3);
    sendData.Bus = {
      ID: bus._id,
      Name: bus.BusName
    }
    sendData.Driver = {
      ID: Driver._id,
      Name: Driver.Name
    }
    sendData.Stop1 = {
      ID: stop1._id,
      Name: stop1.LocationName
    }
    sendData.Stop2 = {
      ID: stop2._id,
      Name: stop2.LocationName
    }
    sendData.Stop3 = {
      ID: stop3._id,
      Name: stop3.LocationName
    }
    console.log(sendData)
    if (errorList.length < 1) {
      axios.post(`/api/createRoute`, sendData)
        .then(response => {
          let routesData = [...routes];
          routesData.push(response.data);
          setRoutes(routesData);
          resolve()
          setErrorMessages([])
          setIserror(false)
        })
        .catch(error => {
          setErrorMessages(["Cannot add data. Server error!"])
          setIserror(true)
          resolve()
        })
    } else {
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }
  }


  return (
    <div className="app">
      {/* <h1>Material Table Example Using JSONPlaceholder API</h1> <br /><br /> */}

      <MaterialTable
        title="Route Details"
        columns={columns}
        data={routes}
        options={{
          headerStyle: { borderBottomColor: 'red', borderBottomWidth: '3px', fontFamily: 'verdana' },
          actionsColumnIndex: -1
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              handleRowAdd(newData, resolve)
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              handleRowDelete(oldData, resolve)
            }),
        }}
      />

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
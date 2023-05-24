import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import axios from '../services/axiosInterceptor';
import { Alert, AlertTitle } from '@mui/lab';
import { Container } from '@mui/material';


const Location = () => {

  const [locations, setLocations] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  let columns = [
    { title: 'Location Name', field: 'LocationName' }
  ]


  useEffect(() => {
    axios.get(`api/getAllLocations`)
      .then(res => {
        const locations = res.data;
        setLocations(locations);
        console.log(locations);
      })
  }, [])



  //function for updating the existing row details
  const handleRowUpdate = (newData, oldData, resolve) => {
    //validating the data inputs
    let errorList = []
    if (newData.LocationName === "") {
      errorList.push("Try Again, You didn't enter the name field")
    }

    if (errorList.length < 1) {
      axios.put(`/api/updatelocation/${newData._id}`, newData)
        .then(response => {
          // debugger
          const updateLocation = [...locations];
          const index = oldData.tableData.id;
          updateLocation[index] = response.data;
          setLocations([...updateLocation]);
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
    console.log(oldData)
    axios.delete(`/api/deletelocation/${locations[oldData.tableData.id]._id}`)
      .then(response => {
        // debugger
        const dataDelete = [...locations];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setLocations([...dataDelete]);
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
    if (newData.LocationName === "") {
      errorList.push("Try Again, You didn't enter the Location Name field")
    }

    if (errorList.length < 1) {
      axios.post(`/api/createLocation`, newData)
        .then(response => {
          console.log(response);
          let newLocation = [...locations];
          newLocation.push(response.data);
          setLocations(newLocation);
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
    <Container>

      <MaterialTable
        title="Location Details"
        columns={columns}
        data={locations}
        options={{
          headerStyle: { borderBottomColor: 'red', borderBottomWidth: '3px', fontFamily: 'verdana' },
          actionsColumnIndex: -1
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              handleRowUpdate(newData, oldData, resolve);

            }),
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

    </Container>
  );
}

export default Location;
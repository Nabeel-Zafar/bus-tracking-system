import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import axios from '../services/axiosInterceptor';
import { Alert, AlertTitle } from '@mui/lab';
import { Container } from '@mui/material';


const Buses = () => {

  const [buses, setBuses] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  let columns = [
    { title: 'Bus Name', field: 'BusName' }
  ]


  useEffect(() => {
    axios.get(`/api/getAllBuses`)
      .then(res => {
        const users = res.data;
        setBuses(users);
        // console.log(users);
      })
  }, [])



  //function for updating the existing row details
  const handleRowUpdate = (newData, oldData, resolve) => {
    //validating the data inputs
    let errorList = []
    if (newData.BusName === "") {
      errorList.push("Try Again, You didn't enter the name field")
    }

    if (errorList.length < 1) {
      axios.put(`/api/updatebus/${newData._id}`, newData)
        .then(response => {
          const updateUser = [...buses];
          const index = oldData.tableData.id;
          updateUser[index] = newData;
          setBuses([...updateUser]);
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
    axios.delete(`/api/deletebus/${buses[oldData.tableData.id]._id}`)
      .then(response => {
        const dataDelete = [...buses];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setBuses([...dataDelete]);
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
    if (newData.BusName === "") {
      errorList.push("Try Again, You didn't enter the name field")
    }

    if (errorList.length < 1) {
      axios.post(`/api/createBus`, newData)
        .then(response => {
          let busesData = [...buses];
          busesData.push(response.data);
          setBuses(busesData);
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
        title="Buses Details"
        columns={columns}
        data={buses}
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

export default Buses;
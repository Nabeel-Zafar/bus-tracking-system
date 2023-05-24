import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import axios from '../services/axiosInterceptor';
import { Alert, AlertTitle } from '@mui/lab';
import TextField from '@mui/material/TextField';


function validateEmail( value ) {
	return /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,5}$/.test( value );
}


const Users = () => {

  const [user, setUser] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  let columns = [
    { title: 'NAME', field: 'Name' },
    { title: 'EMAIL', field: 'Email' },
    { title: 'PHONE', field: 'Phone' },
    { 
      title: 'Password', field: 'Password',
      render: newData => <p>{newData && newData.password && newData.password.split('').map(() => '*')}</p>,
      editComponent: props => (
          <TextField
              type="password"
              label="Password" 
              variant="standard"
              value={props.value}
              onChange={e => props.onChange(e.target.value)}
          />)
      },
    { title: 'ROLE', field: 'Role', lookup: { 'Admin': 'Admin', 'Driver': 'Driver' } },
  ]

  useEffect(() => {
    axios.get(`/api/getAllUsers`)
      .then(res => {
        const users = res.data;
        setUser(users);
        // console.log(users);
      })
  }, [])



  //function for updating the existing row details
  const handleRowUpdate = (newData, oldData, resolve) => {
    //validating the data inputs
    let errorList = []
    if (newData.Name === "") {
      errorList.push("Try Again, You didn't enter the name field")
    }
    if (newData.Email === "" || validateEmail(newData.Email) === false) {
      errorList.push("Oops!!! Please enter a valid email")
    }
    if (newData.Phone === "") {
      errorList.push("Try Again, Phone number field can't be blank")
    }
    if (newData.Role === "") {
      errorList.push("Try Again, Phone number field can't be blank")
    }
    if (newData.Password === "") {
      errorList.push("Try Again, Phone number field can't be blank")
    }

    if (errorList.length < 1) {
      axios.put(`/api/updateuser/${user[oldData.tableData.id]._id}`, newData)
        .then(response => {
          const updateUser = [...user];
          const index = oldData.tableData.id;
          updateUser[index] = newData;
          setUser([...updateUser]);
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
    axios.delete(`/api/deleteuser/${user[oldData.tableData.id]._id}`)
      .then(response => {
        const dataDelete = [...user];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setUser([...dataDelete]);
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
    // debugger
    let errorList = []
    if (newData.Name === "") {
      errorList.push("Try Again, You didn't enter the name field")
    }
    if (newData.Email === "" || validateEmail(newData.Email) === false) {
      errorList.push("Try Again, You didn't enter the Username field")
    }
    if (newData.Phone === "") {
      errorList.push("Oops!!! Please enter a valid email")
    }
    if (newData.Role === "") {
      errorList.push("Try Again, Phone number field can't be blank")
    }
    if (newData.Password === "") {
      errorList.push("Try Again, Phone number field can't be blank")
    }

    if (errorList.length < 1) {
      axios.post(`/api/createUser`, newData)
        .then(response => {
          let newUserdata = [...user];
          newUserdata.push(response.data);
          setUser(newUserdata);
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
        title="User Details"
        columns={columns}
        data={user}
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

    </div>
  );
}

export default Users;
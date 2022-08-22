import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Stack from '@mui/material/Stack';

import axios from '../services/axiosInterceptor';

const steps = [
  {
    label: 'Start Stop 1',
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: 'Stop 2',
    description:
      'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Stop 3',
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
  {
    label: 'Stop Finised',
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

export default function Driver() {

  const [userRoute, setUserRoute] = React.useState({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [value, setValue] = React.useState(new Date());
  const stops = {
    0: "Stop1",
    1: "Stop2",
    2: "Stop3",
  }

  React.useEffect(() => {
    axios.get(`/api/getUserRoute`)
      .then(res => {
        const route = res.data.data || {};
        setUserRoute(route);
        if(route.Stop1 &&  !route.Stop1.ActualTime){
          setActiveStep(0)
        }
        else 
        if(route.Stop2 &&  !route.Stop2.ActualTime){
          setActiveStep(1)
        }
        else if(route.Stop3 && !route.Stop3.ActualTime ){
          setActiveStep(2)
        }else {
          setActiveStep(3)
        }
        // console.log(users);
      })
  }, [])

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const saveNextStep = () => {
    const sendData = {
      [`${stops[activeStep]}.EstimatedTime`]: value
    }
    axios.put(`/api/updateUserRoute/${userRoute._id}`, sendData)
      .then(res => {
          let data = {...userRoute};
          data[stops[activeStep]].EstimatedTime = value
          setUserRoute(data);
        // console.log(users);
      })
  }

  const Arrived = () => {
    const sendData = {
      [`${stops[activeStep]}.ActualTime`]: new Date()
    }
    axios.put(`/api/updateUserRoute/${userRoute._id}`, sendData)
      .then(res => {
          const route = {...userRoute}
          route[stops[activeStep]].ActualTime = value;
          setUserRoute(route);
          if(route.Stop1 &&  !route.Stop1.ActualTime){
            setActiveStep(0)
          }
          else 
          if(route.Stop2 &&  !route.Stop2.ActualTime){
            setActiveStep(1)
          }
          else if(route.Stop3 && !route.Stop3.ActualTime ){
            setActiveStep(2)
          }else if(route.Stop3 && route.Stop3.ActualTime) {
            setActiveStep(4)
          }
        // console.log(users);
      })
  }

  return (
    <Box sx={{ maxWidth: 400 }}>
      {userRoute && userRoute.Stop1 && userRoute.Stop1 ?<Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
            //   optional={
            //     index === 2 ? (
            //       <Typography variant="caption">Last step</Typography>
            //     ) : null
            //   }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              {userRoute[stops[activeStep]] && !userRoute[stops[activeStep]].EstimatedTime ? <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box m={3} textAlign="left">
                  {userRoute[stops[activeStep]] && userRoute[stops[activeStep]].Name && <Typography component="h1">Location Name: {userRoute[stops[activeStep]].Name}</Typography>}
                </Box>
                <TimePicker
                  ampm={false}
                  openTo="hours"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                  mask="__:__"
                  label="Estimated Time to next Stop"
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <Button
                  style={{ marginLeft: '20px' }}
                  variant="contained"
                  sx={{ mt: 1, mr: 1 }}
                  onClick={saveNextStep}
                >
                  Save
                </Button>
              </LocalizationProvider> :
                <Button
                  style={{ marginLeft: '20px' }}
                  variant="contained"
                  sx={{ mt: 1, mr: 1 }}
                  onClick={Arrived}
                >
                  Arrived
                </Button>
              }
              <Box sx={{ mb: 2 }}>
                <div>
                  {/* <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button> */}
                  {/* <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button> */}
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>: <Typography>No Route Assigned to you</Typography>}
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All Stops completed</Typography>
        </Paper>
      )}
    </Box>
  );
}
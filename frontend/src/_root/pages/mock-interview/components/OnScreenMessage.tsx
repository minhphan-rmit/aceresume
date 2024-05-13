import React from 'react';
import { Box, Button, TextField, Typography, duration } from '@mui/material';
import { indigo } from '@mui/material/colors';

const OnScreenMessage = ({ message, buttonMessage, onEventClick }) => {



  return (


    <Box sx={{
      height: '90vh',
      borderRadius: '10px',
      position: 'absolute',
      top: 185,
      left: 40,
      right: 40,
      bottom: 0,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: 4

    }}>
      <Box sx={{ maxWidth:'80%', height:'500px'}}>
      <Typography variant="h6" color="common.white" sx={{ mb: 2, backgroundColor: 'white', color:indigo[600], borderRadius:'10px', padding: '1rem',maxHeight:'300px', overflowY:'scroll'}}>
       {message}
      </Typography>

      <Button variant="contained" color="primary"  sx={{ padding: 2, height: '100', width:'100%' }} onClick={()=> onEventClick()}>
        {buttonMessage}
      </Button>
      </Box>
    </Box>

  );
};

export default OnScreenMessage;

import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const InterviewSettings = ({ onStartInterview }) => {
  const [duration, setDuration] = React.useState('');
  const [role, setRole] = React.useState('');
  const [jobDescription, setJobDescription] = React.useState('');



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
      <Box sx={{ maxWidth:'30%'}}>
      <Typography variant="h6" color="common.white" sx={{ mb: 2 }}>
        Enter Interview Duration (minutes), Role and your desired Job Description:
      </Typography>
      <TextField
        label="Duration"
        variant="filled"
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        sx={{ mb: 2, backgroundColor: 'common.white', width: '100%', borderRadius: '10px' }}
      />
      <TextField
        label="Role"
        variant="filled"
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        sx={{ mb: 2, backgroundColor: 'common.white', width: '100%', borderRadius: '10px' }}
      />
       <TextField
        label="Job Description"
        variant="filled"
        type="text"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        sx={{ mb: 2, backgroundColor: 'common.white', width: '100%', borderRadius: '10px' }}
      />
      <Button variant="contained" color="primary" onClick={() => onStartInterview(duration, role, jobDescription)} sx={{ padding: 2, height: '100', width:'100%' }}>
        Start Interview
      </Button>
      </Box>
    </Box>

  );
};

export default InterviewSettings;

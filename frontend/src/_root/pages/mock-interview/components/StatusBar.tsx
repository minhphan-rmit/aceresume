import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const StatusBar = ({ interviewDetails }) => (
  <Grid container spacing={2} sx={{ p: 2, backgroundColor: 'indigo[50]', borderRadius: '10px' }}>
    {Object.entries(interviewDetails).map(([key, value]) => (
      <Grid item xs key={key}>
        <Paper elevation={3} sx={{ padding: 1, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</Typography>
          {

          key =="remainingTime" && <Typography variant="body2">{`${Math.floor(value / 60)} minutes ${value % 60} seconds`} </Typography>}

          {key !=="remainingTime" && <Typography variant="body2">{value}  </Typography>}
        </Paper>
      </Grid>
    ))}
  </Grid>
);

export default StatusBar;

import React from 'react';
import { Box, Typography } from '@mui/material';

const PauseOverlay = () => (
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
        <Typography variant="h5" color="common.white">Paused</Typography>
    </Box>
);

export default PauseOverlay;

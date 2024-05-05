// In Options.js
import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

const Options = ({ onPause, onResume, isPaused }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                •••
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                {isPaused ? (
                    <MenuItem sx={{color:'green'}} onClick={() => { onResume(); handleClose(); }}>Resume</MenuItem>
                ) : (
                    <MenuItem sx={{color:'red'}} onClick={() => { onPause(); handleClose(); }}>Pause</MenuItem>
                )}
                <MenuItem sx={{color:' black'}} onClick={() => {  handleClose(); }}>End Interview</MenuItem>
            </Menu>
        </>
    );
};

export default Options;

import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Options from './Options';

const ControlPanel = ({ inputText, onInputChange, onSendMessage, onPause, onResume, isPaused }) => (
  <Box sx={{ py: 2, borderTop: '1px solid gray', display: 'flex', alignItems: 'center' }}>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Type your message..."
      value={inputText}
      onChange={onInputChange}
      sx={{ mr: 1, '& fieldset': { borderRadius: '25px' } }}
    />
    <Button variant="contained" onClick={onSendMessage} endIcon={<SendIcon />} disabled={!inputText.trim()}>
      Send
    </Button>
    <Options onPause={onPause} onResume={onResume} isPaused={isPaused} />
  </Box>
);

export default ControlPanel;

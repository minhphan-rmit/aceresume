import React, { useEffect, useRef } from 'react';
import { List, ListItem, Box, Typography, Avatar } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { indigo, grey } from "@mui/material/colors";



const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const userAvatar = "/path/to/userAvatar.jpg"; // Path to the user's avatar
const interviewerAvatar = "/path/to/applicationLogo.jpg"; // Path to the application's logo (used for AI)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const theme = useTheme();

  return (
    <List sx={{ overflow: 'auto', flexGrow: 1, maxHeight: '65%', '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { backgroundColor: indigo[300] } }}>
      {messages.map((message, index) => (
        <ListItem key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <Avatar src={message.sender === 'user' ? userAvatar : interviewerAvatar} sx={{ width: 30, height: 30 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{message.name}</Typography>
              <Typography variant="body2">{message.timestamp}</Typography>
            </Box>
          </Box>
          <Typography variant="body1" sx={{
            background: message.sender === 'user' ? grey[50] : indigo[500],
            color: message.sender === 'user' ? 'text.primary' : 'common.white',
            borderRadius: '10px',
            padding: '10px',
            wordWrap: 'break-word',
            mt: 1,
            maxWidth: '80%'
          }}>
            {message.text}
          </Typography>
        </ListItem>
      ))}
      <div ref={messagesEndRef} />
    </List>
  );
};

export default MessageList;

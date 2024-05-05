import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Container, TextField, List, ListItem, Typography, Avatar, Paper, Grid } from '@mui/material';
import Options from './Options';


import SendIcon from '@mui/icons-material/Send';
import { indigo, grey } from "@mui/material/colors";

interface Message {
  text: string;
  sender: 'user' | 'ai';
  name: string;
  timestamp: string;
}

const userAvatar = "/path/to/userAvatar.jpg"; // Path to the user's avatar
const interviewerAvatar = "/path/to/applicationLogo.jpg"; // Path to the application's logo (used for AI)

const interviewDetails = {
  interviewer: "AI Interviewer",
  interviewee: "John Doe",
  startTime: "",
  duration: "",
  status: "Ongoing",
  remainingTime: ""
};

const InterviewChat = () => {
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hi there! I'm here to help you prepare for your next job interview. What would you like to practice today?", sender: 'ai', name: "AI Interviewer", timestamp: new Date().toLocaleTimeString() },
        { text: "Can we start with common project management questions?", sender: 'user', name: "John Doe", timestamp: new Date().toLocaleTimeString() },
        { text: "Sure! Let's start with a simple one. How do you handle project requirements?", sender: 'ai', name: "AI Interviewer", timestamp: new Date().toLocaleTimeString()}

    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [duration, setDuration] = useState('');
    const [remainingTime, setRemainingTime] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [isPaused, setIsPaused] = useState(false);


    const startInterview = () => {
        const now = new Date();
        const initialTime = parseInt(duration) * 60;  // Convert minutes to seconds
        setStartTime(now.toLocaleTimeString());
        setInterviewStarted(true);
        setRemainingTime(initialTime);  // Initialize remaining time
        interviewDetails.startTime = now.toLocaleTimeString();
        interviewDetails.duration = `${duration} minutes`;


    };
    useEffect(() => {
        let intervalId = null;
        if (interviewStarted && !isPaused && remainingTime > 0) {
            intervalId = setInterval(() => {
                setRemainingTime(time => time - 1);
            }, 1000);
        } else {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [interviewStarted, remainingTime, isPaused]);

    // handle pause
    const handlePause = () => {
        setIsPaused(true);
    };

    const handleResume = () => {
        setIsPaused(false);
    };

    // Display remaining time in a human-readable format
    const formattedTime = `${Math.floor(remainingTime / 60)}:${String(remainingTime % 60).padStart(2, '0')}`;

    const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDuration(event.target.value);
    };

    const handleSendMessage = () => {
        if (inputText.trim() !== '') {
            const newUserMessage: Message = { text: inputText, sender: 'user', name: "John Doe", timestamp: new Date().toLocaleTimeString() };
            setMessages(messages => [...messages, newUserMessage]);
            setInputText('');

            setTimeout(() => {
                const newAIMessage: Message = { text: "Great! Let's discuss how you would handle a project where the requirements are frequently changing.", sender: 'ai', name: "AI Interviewer", timestamp: new Date().toLocaleTimeString() };
                setMessages(messages => [...messages, newAIMessage]);
            }, 1000);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSendMessage();
            event.preventDefault();
        }
    };
    const createHandleMenuClick = (menuItem: string) => {
        return () => {
          console.log(`Clicked on ${menuItem}`);
        };
      };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {!interviewStarted && (
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
                    <div className="flex flex-row gap-6 items-center">
                    <div> <Typography variant="h6" color="common.white" sx={{ mb: 2 , }}>
                        Enter Interview Duration (minutes):
                    </Typography>
                    <TextField
                        label="Duration"
                        variant="filled"
                        type="number"
                        value={duration}
                        onChange={handleDurationChange}
                        sx={{ mb: 2, backgroundColor: 'common.white', width: '300px', borderRadius: '10px'}}
                    /></div>

                    <Button variant="contained" color="primary" onClick={startInterview} sx={{ padding: 2, height:'50%' }}>
                        Start Interview
                    </Button></div>

                </Box>
            )}
            {isPaused && (
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
)}
             <Grid container spacing={2} sx={{ p: 2, backgroundColor: 'indigo[50]', borderRadius: '10px' }}>
      {Object.entries(interviewDetails).map(([key, value]) => (
        <Grid item xs key={key}>
          <Paper elevation={3} sx={{ padding: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</Typography>
            <Typography variant="body2">
              {key === 'remainingTime' ? formattedTime : value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
            <List sx={{ overflow: 'auto', flexGrow: 1, maxHeight: '65%', '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { backgroundColor: indigo[300] } }}>
                {messages.map((message, index) => (
                    <ListItem key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                            <Avatar src={message.sender === 'user' ? userAvatar : interviewerAvatar} sx={{ width: 30, height: 30 }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{message.name}</Typography>

                                <Typography variant="body2">{message.timestamp}</Typography>                            </Box>

                        </Box>
                        <Typography variant="body1" sx={(theme) => ({
  background: message.sender === 'user' ? grey[50] : indigo[500],
  color: message.sender === 'user' ? theme.palette.text.primary : theme.palette.common.white,
  borderRadius: '10px',
  padding: '10px',
  wordWrap: 'break-word',
  mt: 1,
  maxWidth: '80%'
})}>
  {message.text}
</Typography>

                    </ListItem>
                ))}
                <div ref={messagesEndRef} />
            </List>
            <Box sx={{ py: 2, borderTop: '1px solid gray', display: 'flex', alignItems: 'center' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message..."
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    sx={{ mr: 1, '& fieldset': { borderRadius: '25px' } }}
                />
                <Button variant="contained" onClick={handleSendMessage} endIcon={<SendIcon />} disabled={!inputText.trim()}>
                    Send
                </Button>
                <div className="options"><Options onPause={handlePause} onResume={handleResume} isPaused={isPaused} />
</div>
            </Box>



        </Container>
    );
};

export default InterviewChat;

import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Container, TextField, List, ListItem, Typography, Avatar, Paper, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { indigo } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "../../../styles/getLPTheme";
import AppNavBar from '../../components/NavBar/AppAppBar';
import FeatureBar from '../../components/FeatureBar/FeatureBar';
import CVAnalysisSideBar from '../CVAnalysis/components/CVAnalysisSideBar'; // Import the CVAnalysisSideBar component

interface Message {
  text: string;
  sender: 'user' | 'ai';
  name: string;
  timestamp: string;
}

const userAvatar = "/path/to/userAvatar.jpg"; // Path to the user's avatar
const interviewerAvatar = "/path/to/applicationLogo.jpg"; // Path to the application's logo (used for AI)
const LPtheme = createTheme(getLPTheme());

const interviewDetails = {
  interviewer: "AI Interviewer",
  interviewee: "John Doe",
  startTime: "9:00 AM",
  duration: "30 minutes",
  status: "Ongoing"
};

const MockInterview = () => {
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hi there! I'm here to help you prepare for your next job interview. What would you like to practice today?", sender: 'ai', name: "AI Interviewer", timestamp: new Date().toLocaleTimeString() },
        { text: "Can we start with common project management questions?", sender: 'user', name: "John Doe", timestamp: new Date().toLocaleTimeString() },
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null); // Specify the type for useRef

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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <ThemeProvider theme={LPtheme}>
            <AppNavBar/>
            <div><FeatureBar/></div>
            <Grid container spacing={2} className="p-10">
                {/* Sidebar Component */}
                <Grid item xs={3}>
                    <CVAnalysisSideBar onChange={undefined} />
                </Grid>
                {/* Interview details and conversation */}
                <Grid item xs={9}>
                    <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Grid container spacing={2} sx={{ p: 2, backgroundColor: indigo[50] }}>
                            {Object.entries(interviewDetails).map(([key, value]) => (
                                <Grid item xs={12} key={key}>
                                    <Paper elevation={3} sx={{ padding: 1, textAlign: 'center' }}>
                                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</Typography>
                                        <Typography variant="body2">{value}</Typography>
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
                                            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{message.timestamp}</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body1" sx={{ background: message.sender === 'user' ? indigo[100] : indigo[200], borderRadius: '10px', padding: '10px', wordWrap: 'break-word', mt: 1, maxWidth: '80%' }}>
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
                        </Box>
                    </Container>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default MockInterview;

import React, { useState, useEffect, useRef } from 'react';
import { Container } from '@mui/material';
import MessageList from './MessageList';
import OnScreenMessage from './OnScreenMessage';
import ControlPanel from './ControlPanel';
import InterviewSettings from './InterviewSettings';
import StatusBar from './StatusBar';
import PauseOverlay from './PauseOverlay'; // Assuming it's in the same directory
import getLPTheme from "../../../../styles/getLPTheme";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";

import useInterview from './useInterview';

const InterviewChat = () => {
  const {
    messages,
    welcomeMessage,
    inputText,
    handleInputChange,
    handleSendMessage,
    interviewDetails,
    isPaused,
    handlePause,
    handleResume,
    interviewStarted,
    startInterview,
    pendingSettings,
    showMessage
  } = useInterview();
  useEffect(() => {
    console.log('Welcome message updated:', welcomeMessage);
    console.log('Pending settings:', pendingSettings);
}, [welcomeMessage, pendingSettings, showMessage]);


  const LPtheme = createTheme(getLPTheme());


  return (
    <ThemeProvider theme={LPtheme}>
    <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {!interviewStarted && (
        <InterviewSettings onStartInterview={startInterview} />
      )}
      {isPaused && (
        <PauseOverlay />
      )}
     {interviewStarted && welcomeMessage && (
    <OnScreenMessage
        message={welcomeMessage}
        buttonMessage="Start Interview"
        onEventClick={() => startInterview(pendingSettings.duration, pendingSettings.role, true)}
        showMessage={true}
    />
)}

      <StatusBar interviewDetails={interviewDetails} />
      <MessageList messages={messages} />
      <ControlPanel
        inputText={inputText}
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
        onPause={handlePause}
        onResume={handleResume}
        isPaused={isPaused}
      />
    </Container>
    </ThemeProvider>
  );
};

export default InterviewChat;

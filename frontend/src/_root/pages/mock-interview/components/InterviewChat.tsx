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
    role,
   handleEnd,
   handleRestart,
   feedback,
    jobDescription,
    isEnd
  } = useInterview();
  useEffect(() => {

}, [welcomeMessage, role, jobDescription, feedback]);


  const LPtheme = createTheme(getLPTheme());


  return (
    <ThemeProvider theme={LPtheme}>
    <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {!interviewStarted && !isEnd &&(
        <InterviewSettings onStartInterview={startInterview} />
      )}
      {isPaused && (
        <PauseOverlay />
      )}
     { isEnd && (
    <OnScreenMessage
        message='Reviewing and Generating Feedback...'
        buttonMessage="Restart the Intervew"
        onEventClick={handleRestart}


    />
)}

{ isEnd && feedback &&(
    <OnScreenMessage
        message={feedback}
        buttonMessage="Restart the Intervew"
        onEventClick={handleRestart}

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
        onEnd={()=> handleEnd(false)}

      />
    </Container>
    </ThemeProvider>
  );
};

export default InterviewChat;

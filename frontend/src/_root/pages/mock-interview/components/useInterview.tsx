import { useState, useEffect } from 'react';
import { startNewChat, reviewInterview, sendMessage } from './handleInterviewAPI';
import { set } from 'firebase/database';

const useInterview = () => {
const [welcomeMessage, setWelcomeMessage] = useState('');
const [jobDescription, setJobDescription] = useState('');
const [role, setRole] = useState('');
const [feedback, setFeedback] = useState('');

const userId = localStorage.getItem('userId') ?? '663852ecd568222769540792';
const username = localStorage.getItem('username') ?? 'Ha Phuong Tran';
const API_BASE_URL = ' https://ace-resume-backend-7fotus647q-as.a.run.app/api/aceresume/chat-interview'; // Adjust according to your server address


  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [interviewDetails, setInterviewDetails] = useState({
    interviewer: "AI Interviewer",
    interviewee: "John Doe",
    startTime: "",
    duration: "",
    role: "",
    remainingTime: 0
  });
  const [isPaused, setIsPaused] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    let interval = null;
    if (interviewStarted && !isPaused && interviewDetails.remainingTime > 0) {
      interval = setInterval(() => {
        setInterviewDetails(prevDetails => {
          // Check if remaining time after decrement will be zero
          const updatedTime = prevDetails.remainingTime - 1;
          if (updatedTime === 0) {
            handleEnd(true);  // Automatically end the interview when time expires
          }
          return {
            ...prevDetails,
            remainingTime: updatedTime
          };
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [interviewStarted, isPaused, interviewDetails.remainingTime]);


  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newMessage = { text: inputText, sender: 'user', name: username, timestamp: new Date().toLocaleTimeString() };

      // Set user message and then add the placeholder in the next state update
      setMessages(prevMessages => [...prevMessages, newMessage]);

      // Add a placeholder for the AI response
      setMessages(prevMessages => [...prevMessages, { text: '...', sender: 'ai', name: "AI Interviewer", timestamp: new Date().toLocaleTimeString() }]);

      // Call the API to send the message
      const response = await sendMessage(userId, inputText, role, jobDescription);
      if (response) {
        console.log(response);

        // Update the placeholder message with the actual response
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            text: response,
            sender: 'ai',
            name: "AI Interviewer",
            timestamp: new Date().toLocaleTimeString()
          };
          return updatedMessages;
        });
      }
    }
    setInputText('');
  };




    const handleEnd = async (isTime: boolean) => {

        const confirm = window.confirm('Are you sure you want to end the interview?');
        if (!confirm ) {
            return;
        }


        if (confirm || isTime) {
        setIsEnd(true);
            const response = await reviewInterview(userId, role, jobDescription);
            if (response) {
                console.log(response);

                setFeedback(response);
                setInterviewStarted(false);
                setMessages([]);
                return;
            }
        }
        if (!isTime) {
           return
        }
    }

    const handleRestart = () => {
        setIsEnd(false);
        setFeedback('');
        setInterviewStarted(false);
        setMessages([]);
    }
  const startInterview = async (duration, role, jobDescription) => {

    setJobDescription(jobDescription);
    setRole(role);
    const response = await startNewChat(userId, role);
    if (response){
    setWelcomeMessage(response);
    setInterviewStarted(true);

    const welcomeMsg = {
        text: response,  // Use the welcome message as the text for the message
        sender: 'ai',    // Assuming 'ai' is the identifier for system messages
        name: "AI Interviewer",
        timestamp: new Date().toLocaleTimeString()
    };

    // Update the messages state to include the welcome message
    setMessages(prevMessages => [...prevMessages, welcomeMsg]);

        setInterviewDetails({
          interviewer: "AI Interviewer",
          interviewee: username,
          startTime: new Date().toLocaleTimeString(),
          duration: `${duration} minutes`,
          role,
          remainingTime: parseInt(duration) * 60
        })


    }







  };

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  return {
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
    jobDescription,
    handleEnd,
    feedback,
    handleRestart,
    isEnd,


  };
};

export default useInterview;

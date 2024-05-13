import { useState, useEffect } from 'react';
import { startNewChat, reviewInterview, sendMessage } from './handleInterviewAPI';

const useInterview = () => {
const [welcomeMessage, setWelcomeMessage] = useState('');
const [pendingSettings, setPendingSettings] = useState({ duration: '', role: '' });
const [showMessage, setShowMessage] = useState(false);


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

  useEffect(() => {
    let interval = null;
    if (interviewStarted && !isPaused && interviewDetails.remainingTime > 0) {
      interval = setInterval(() => {
        setInterviewDetails(prevDetails => ({
          ...prevDetails,
          remainingTime: prevDetails.remainingTime - 1
        }));
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [interviewStarted, isPaused, interviewDetails.remainingTime]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = { text: inputText, sender: 'user', name: "John Doe", timestamp: new Date().toLocaleTimeString() };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const startInterview = async (duration, role, isStart) => {
    const userId = localStorage.getItem('userId') ?? '663852ecd568222769540792';
    const username = localStorage.getItem('username') ?? 'Ha Phuong Tran';

    const response = await startNewChat(userId, role);
    if (response){
    setWelcomeMessage(response);
    setInterviewStarted(true);
    setShowMessage(true);
    if (isStart) {
        const { duration, role } = pendingSettings;

        setInterviewDetails({
          interviewer: "AI Interviewer",
          interviewee: username,
          startTime: new Date().toLocaleTimeString(),
          duration: `${duration} minutes`,
          role,
          remainingTime: parseInt(duration) * 60
        })
        setShowMessage(false);
    }
    else {
        setPendingSettings({ duration, role });
    }
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
    pendingSettings,
    showMessage


  };
};

export default useInterview;

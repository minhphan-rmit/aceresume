import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/aceresume/chat-interview'; // Adjust according to your server address

export const startNewChat = async (userId: string, role: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/new_chat/${userId}/${role}`);
    return response.data;  // assuming the server sends back data as response
  } catch (error) {
    console.error("Error starting new chat:", error);
    return null;
  }
};

export const sendMessage = async (userId: string, message: string, role: string, jobDescription: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat/${userId}/${role}`, {
      message,
      role,
      jobDescription
    });
    return response.data;  // assuming the server sends back data as a stream or JSON
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

export const reviewInterview = async (userId: string, role: string, jobDescription: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/review/${userId}/${role}`, {
      role,
      jobDescription
    });
    return response.data;  // assuming the server sends back data as a stream or JSON
  } catch (error) {
    console.error("Error reviewing interview:", error);
    return null;
  }
};

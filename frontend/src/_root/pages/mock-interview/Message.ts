interface Message {
  text: string;
  sender: 'user' | 'ai';
  name: string;
  timestamp: string;
  remainingTime?: string;
}

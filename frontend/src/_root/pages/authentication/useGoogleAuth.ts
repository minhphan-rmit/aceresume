import { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import firebaseApp from '../../../config/firebase-config'; // Ensure the path is correct

const useGoogleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');

  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  // Function to send email to backend
  const sendEmailToBackend = async (email: string) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send email to backend');
      }
    } catch (error: any) {
      console.error('Error sending email to backend:', error);
      setError('Error sending email to backend');
    }
  };

  const sendRegisteredDetailsToBackend = async (email: string, username: string, password: string) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to sign up');
      }
    } catch (error: any) {
      console.error('Error sending details to backend:', error);
      setError('Error sending details to backend');
    }
  };

  const signInWithGoogle = async () => {
    try {

      const result = await signInWithPopup(auth, provider);

      if (!result.user) throw new Error('No credentials returned from Google.');
      const email = result.user.email;
      if (!email) throw new Error('Email is required but was not provided.');

      setUser(result.user);
      await sendEmailToBackend(email);
    } catch (error: any) {
        console.log(error);
        console.log(error.message);
        console.log(error.code);
      console.error('Error during Google sign-in:', error);
      setError('Error signing in with Google. Please try again.');
    }
  };

  const signUpWithGoogle = async (password: string) => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (!result.user) throw new Error('Google sign-in failed to provide user details.');

      // Check if email and displayName are not null
      const email = result.user.email;
      const displayName = result.user.displayName || ''; // Default to empty string if null

      if (!email) throw new Error('Email is required but was not provided.');

      setUser(result.user);
      await sendRegisteredDetailsToBackend(email, displayName, password);
    } catch (error: any) {
      console.error('Error during Google sign-up:', error);
      setError(error.message || 'Error signing up with Google. Please try again.');
    }
  };
  return { signInWithGoogle, signUpWithGoogle, user, error };

}
export default useGoogleAuth;

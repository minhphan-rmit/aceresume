import { useState } from 'react';
import { getAuth, GoogleAuthProvider, User, signInWithPopup } from 'firebase/auth';
import firebaseApp from '../../../config/firebase-config'; // Ensure the path is correct
import { FormEvent } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import showNotification from '../../components/Notification/Notification';

const useGoogleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');

  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  provider.addScope('profile');
  provider.addScope('email');

  // Function to send email to backend
  const sendEmailToBackend = async (email: string) => {
    try {

      const response = await axios.post('http://localhost:8000/api/aceresume/google/login', { email },{

        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        }

      });
      if (response.status !== 200) {
        const data = await response.data();
        throw new Error(data.message || 'Failed to sign in with Google');
      }
      if (response.status === 200) {
       showNotification({type: 'success', message: 'Login successful! Welcome back!, ' + email + '!'})
       localStorage.setItem('userId', response.data.user_id)
        localStorage.setItem('userName', response.data.username)
        navigate('/home')
      }
    } catch (error: any) {
      console.error('Error sending email to backend:', error);
      setError('Error sending email to backend');
    }
  };

  const sendRegisteredDetailsToBackend = async (email: string, user_name: string, password:string) => {
    try {

     const submissionData = {email, user_name, password};
     console.log(submissionData);
      const response = await axios.post('http://localhost:8000/api/aceresume/google/register', submissionData,{

        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        }

      });
      if (response.status !== 200) {
        const data = await response.data();
        throw new Error(data.message || 'Failed to sign up with Google');
      }
      if (response.status === 200) {
        navigate('/auth/activation-success');
       showNotification({type: 'success', message: 'Registration complete! Check your email to explore more!'})
      }
    } catch (error: any) {
      console.error('Error sending details to backend:', error);
      setError('Error sending details to backend');
    }
  };


  // Function to sign in with Google

  const signInWithGoogle = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const result = await signInWithPopup(auth, provider);

      // retrieve email from user


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



// Function to sign up with Google
  const signUpWithGoogle = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const result = await signInWithPopup(auth, provider);
      if (!result.user) throw new Error('Google sign-in failed to provide user details.');

      // Check if email and displayName are not null
      const email = result.user.email;
      const displayName = result.user.displayName || ''; // Default to empty string if null



      if (!email) throw new Error('Email is required but was not provided.');
      if (!displayName) throw new Error('Username is required but was not provided.');

      // delete whitespace in displayName and special characters
      const username = displayName.replace(/\s/g, '');


      // success
      navigate('/auth/add-password?email=' + email + '&username=' + username);

      setUser(result.user);

    } catch (error: any) {
      console.error('Error during Google sign-up:', error);
      setError(error.message || 'Error signing up with Google. Please try again.');
    }
  };
  return { signInWithGoogle, signUpWithGoogle, user, error, sendRegisteredDetailsToBackend };

}
export default useGoogleAuth;

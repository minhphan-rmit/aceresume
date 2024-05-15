import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import axios from 'axios';
import { UserFormData, validateEmail, validatePassword } from './UserFormData';
import showNotification from '../../components/Notification/Notification';
import {useNavigate} from 'react-router-dom';

interface InputRefs {
  [key: string]: React.RefObject<HTMLInputElement>;
}

interface UseFormProps {
  initialValues: UserFormData;
}

const useForm = ({ initialValues }: UseFormProps) => {
  const [formData, setFormData] = useState<UserFormData>(initialValues);
  const inputRefs = useRef<InputRefs>({});
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setFormData(initialValues);
    clearErrorStyles();
  };

  const setInputRef = (name: string, ref: React.RefObject<HTMLInputElement>) => {
    inputRefs.current[name] = ref;
  };

  const displayErrorMessage = (inputName: string, message: string) => {
    const inputElement = inputRefs.current[inputName]?.current;
    if (inputElement) {
      inputElement.classList.add('border-red-500');
      const errorMessage = document.createElement('p');
      errorMessage.className = 'error-message text-red-500';
      errorMessage.textContent = message;
      inputElement.parentNode?.insertBefore(errorMessage, inputElement.nextSibling);
    }
  };

  const clearErrorStyles = () => {
    Object.keys(inputRefs.current).forEach(field => {
      const inputElement = inputRefs.current[field]?.current;
      if (inputElement) {
        inputElement.classList.remove('border-red-500');
        const errorMessage = inputElement.parentNode?.querySelector('.error-message');
        errorMessage?.remove();
      }
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors: Record<string, string> = {};

    if (!validateEmail(formData.email)) {
      errors.email = "Enter a valid email";
      isValid = false;
    }

    if (!validatePassword(formData.password)) {
      errors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    if (formData.password !== formData.repassword) {
      errors.repassword = "Passwords do not match";
      isValid = false;
    }

    Object.keys(errors).forEach(key => displayErrorMessage(key, errors[key]));
    return isValid;
  };

  const register = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const { repassword, ...submissionData } = formData;
      console.log('Submission data:', submissionData);
      const response = await axios.post('http://localhost:8000/api/aceresume/register', submissionData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
      });

      // if response is successful, show notification
      if (response.status === 200){
      showNotification({type: 'info', message: 'Registration almost complete! Check your email to activate your account!'})
      clearForm();
      navigate('/sign-up')}
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data?.detail || error.message);
      alert(`Registration failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const signin= async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    try {
      const { ...submissionData } = formData;
      console.log('Submission data:', submissionData);
      const response = await axios.post('http://localhost:8000/api/aceresume/login', submissionData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
      });

      if(response.status === 200){
        const username = response.data.username;
        console.log('Login successful:', response.data);
        showNotification({type: 'success', message: 'Login successful! Welcome back, ' + username + '!'})
        localStorage.setItem('userId', response.data.user_id)
        localStorage.setItem('userName', response.data.username)
        navigate('/home')
      }
      else {
        showNotification({type: 'error', message: 'Login failed:' })
      }
      clearForm();
    } catch (error: any) {
      console.error('Sign in failed:', error.response?.data?.detail || error.message);
      alert(`Sign in failed: ${error.response?.data?.message || error.message}`);
      showNotification({type: 'error', message: 'Sign in failed!'})
    }
  }

  return { formData, handleChange, clearForm, setInputRef, displayErrorMessage, clearErrorStyles, register, signin };
};

export default useForm;

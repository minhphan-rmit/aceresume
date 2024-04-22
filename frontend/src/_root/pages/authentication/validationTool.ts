// Import necessary types from React
import { RefObject } from 'react';

// Interface for input references
interface InputRefs {
  [key: string]: RefObject<HTMLInputElement>;
}

// Function to display error messages next to the input fields
export const displayErrorMessage = (inputRefs: InputRefs, inputName: string, message: string) => {
  const inputElement = inputRefs[inputName].current;
  if (inputElement) {
    inputElement.classList.add('border-red-500'); // Add the class to show red border
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    inputElement.parentNode?.insertBefore(errorMessage, inputElement.nextSibling);
  }
};

// Function to clear all error messages and reset styles
export const clearErrorStyles = (inputRefs: InputRefs) => {
  Object.keys(inputRefs).forEach(field => {
    const inputElement = inputRefs[field].current;
    if (inputElement) {
      inputElement.style.border = '1px solid #ccc';
    }

    const errorMessages = document.querySelectorAll(`.error-message`);
    errorMessages.forEach(message => message.remove());
  });
};

// Function to validate email addresses
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate phone numbers
export const validateNumber = (number: string): boolean => {
  const numberRegex = /^[\d\-() ]+$/;
  return numberRegex.test(number);
};


// Function to validate passwords
export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
}

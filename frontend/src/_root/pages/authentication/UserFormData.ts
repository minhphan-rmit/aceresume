export interface UserFormData {
    user_name?: string;
    email: string;
    password: string;
    repassword?: string;
  }

  export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  export const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

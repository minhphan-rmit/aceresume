
import {FormEvent, useState} from 'react';
import getLPTheme from "../../../styles/getLPTheme";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useSearchParams } from 'react-router-dom';
import useGoogleAuth from './useGoogleAuth';

const AddPassword=()=>{

    const LPtheme = createTheme(getLPTheme());

    const logoStyle = {
        width: "auto",
        height: "32px",
        cursor: "pointer",
      };
      const {sendRegisteredDetailsToBackend} = useGoogleAuth();
      const [password, setPassword] = useState('');
      const [repassword, setRepassword] = useState('');
      const [searchParams] = useSearchParams();
      const user_name = searchParams.get('username');
      const email = searchParams.get('email');

      // Function to handle input change

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'password') {
            setPassword(value);
        } else if (name === 'repassword') {
            setRepassword(value);
        }
    };
      // Function to handle form submission
      const AddPassword = async (e: FormEvent<HTMLFormElement>) => {

          e.preventDefault(); // Prevent the default form submit action
        
          if (password !== repassword) {
              alert("Passwords do not match!");
              return; // Stop the function if passwords do not match
          }

          
          // Here, insert your logic to handle the password update
          sendRegisteredDetailsToBackend(email, user_name, password);

          // This might include sending the password to a backend server

          // Ideally, here you would send a request to your server
      };

    return (
        <ThemeProvider theme={LPtheme}>
               <div
            style={{
              backgroundImage: 'url(../../static/landing-bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: '10% center'
            }}
            className="hidden lg:flex items-center justify-center flex-1 h-screen relative"
          >
            {/* Overlay with full dimensions and absolute positioning */}
            <div className='absolute top-0 left-0 right-0 bottom-0 bg-black opacity-60'></div>
        <div className="relative z-10 lg:flex w-full flex items-center justify-center">
          <div className="lg:w-1/2 xl:max-w-screen-sm bg-white py-10 rounded-lg shadow-lg flex items-center flex-col">
            <div className=" flex justify-center  lg:px-12">
              <div className="cursor-pointer flex items-center">
              <img
                  src={"../../static/aceresume_logo.svg"}
                  style={logoStyle}
                  alt="Logo"
                />
                <div className="text-2xl text-black tracking-wide ml-2 font-semibold">
                ace<span className="text-indigo-900">resume</span>
              </div>
              </div>
            </div>
            <div className='mt-5'>
                <svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.25 10.0546V8C5.25 4.27208 8.27208 1.25 12 1.25C15.7279 1.25 18.75 4.27208 18.75 8V10.0546C19.8648 10.1379 20.5907 10.348 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.40931 10.348 4.13525 10.1379 5.25 10.0546ZM6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.8995 2.75 17.25 5.10051 17.25 8V10.0036C16.867 10 16.4515 10 16 10H8C7.54849 10 7.13301 10 6.75 10.0036V8ZM8 17C8.55228 17 9 16.5523 9 16C9 15.4477 8.55228 15 8 15C7.44772 15 7 15.4477 7 16C7 16.5523 7.44772 17 8 17ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17ZM17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16Z" fill="#4338ca"></path> </g></svg></div>
            <div className="mt-5 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-8 xl:px-24 xl:max-w-2xl">
              <h2 className="text-center text-3xl text-indigo-900 font-display font-semibold lg:text-left xl:text-3xl xl:text-bold">
                Create Your Password
              </h2>
              <h5 className='text-gray-600 italic text-sm text-center mt-5'>Create a new password for future logging</h5>
<form onSubmit={AddPassword}>
<div className='flex flex-col gap-4 mt-5'><input
                  className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                  type="password"
                  placeholder="Password"
                 onChange={handleInputChange}
                  name="password"
                />
                <input
                  className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                  type="password"
                  placeholder="RePassword"
                  onChange={handleInputChange}
                  name="repassword"
                /></div>


              <div className="mt-5">
              <button
              type="submit"

                className="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg"
              >
                Add Password
              </button>
              </div>
                </form>

              </div>
            </div>
          </div>
          </div>

        </ThemeProvider>

    )
}

export default AddPassword;

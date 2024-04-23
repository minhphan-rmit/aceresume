

import getLPTheme from "../../../styles/getLPTheme";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useEffect} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ActivateAccount=()=>{
    const navigate = useNavigate();

    const LPtheme = createTheme(getLPTheme());
    const logoStyle = {
        width: "auto",
        height: "32px",
        cursor: "pointer",
      };



      const [searchParams] = useSearchParams();
      const token = searchParams.get('token');
      const email = searchParams.get('email');
      console.log(token, email);

      const activateAccount = async (token: string, email: string) => {
        try {
            // Prepare form data


              const response = await axios.get('http://localhost:8000/api/aceresume/activate?token='+token+'&email='+email);



            // Optional: Handle successful activation
            console.log('Account successfully activated');
           // redirect to successful activation page


            navigate('/auth/activation-success');
        } catch (error) {
            console.error('Error activating account:', error);
            // Assuming setError is a function to set error state in your component

        }
    };


      useEffect(() => {
          if (token && email) {
              activateAccount(token, email);
          }
      }, [token, email]);



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
                  src={"./static/aceresume_logo.svg"}
                  style={logoStyle}
                  alt="Logo"
                />
                <div className="text-2xl text-black tracking-wide ml-2 font-semibold">
                ace<span className="text-indigo-900">resume</span>
              </div>
              </div>
            </div>
            <div className='mt-5'><svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="#4338ca"></path> </g></svg></div>
            <div className="mt-5 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-8 xl:px-24 xl:max-w-2xl">
              <h2 className="text-center text-3xl text-indigo-900 font-display font-semibold lg:text-left xl:text-3xl xl:text-bold">
                Activating your account...
              </h2>
              <h5 className='text-gray-600 italic text-sm text-center mt-5'>Please wait a moment..</h5>



              </div >

            </div>
          </div>
          </div>

        </ThemeProvider>

    )
}

export default ActivateAccount;

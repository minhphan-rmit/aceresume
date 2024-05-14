import React from 'react';
import { Link } from 'react-router-dom';
import useGoogleAuth from './useGoogleAuth';
import getLPTheme from "../../../styles/getLPTheme";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useForm from './useForm';






  const SigninForm: React.FC = () => {
    const { formData, handleChange, signin } = useForm({
      initialValues: {
        password: '',
        email: '',
      },
    });


  const LPtheme = createTheme(getLPTheme());
   const { signInWithGoogle, user, error } = useGoogleAuth();
  const logoStyle = {
    width: "auto",
    height: "32px",
    cursor: "pointer",
  };
  return (
    <ThemeProvider theme={LPtheme}>
    <div className="lg:flex w-full">
      <div className="lg:w-1/2 xl:max-w-screen-sm">
        <div className="py-12 bg-indigo-100 lg:bg-white flex justify-center lg:justify-start lg:px-12">
          <a href='/landing-page'>
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
          </a>
        </div>
        <div className="mt-10 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-16 xl:px-24 xl:max-w-2xl">
          <h2 className="text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">
            Sign in
          </h2>
          <div className="mt-12">
            <form id="form" onSubmit={signin}>
              <div>
                <div className="text-sm font-bold text-gray-700 tracking-wide">
                  Email
                </div>
                <input
                  className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                  type="email"
                  placeholder="mike@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                />
              </div>
              <div className="mt-8">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold text-gray-700 tracking-wide">
                    Password
                  </div>
                  <div>
                    <a
                      className="text-xs font-display font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>
                <input
                  className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                />
              </div>
              <div className="mt-10">
                <button
                  className="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg"

                >
                  Sign In
                </button>
              </div>
              <div className="mt-5">
                <button
                onClick={signInWithGoogle}
                  className="flex justify-between outline outline-gray-300 text-black p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-gray-200 shadow-lg"
                >
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="-0.5 0 48 48"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"

                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <title>Google-color</title>
                      <desc>Created with Sketch.</desc>
                      <defs></defs>
                      <g
                        id="Icons"
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <g
                          id="Color-"
                          transform="translate(-401.000000, -860.000000)"
                        >
                          <g
                            id="Google"
                            transform="translate(401.000000, 860.000000)"
                          >
                            <path
                              d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                              id="Fill-1"
                              fill="#FBBC05"
                            ></path>
                            <path
                              d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                              id="Fill-2"
                              fill="#EB4335"
                            ></path>
                            <path
                              d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                              id="Fill-3"
                              fill="#34A853"
                            ></path>
                            <path
                              d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                              id="Fill-4"
                              fill="#4285F4"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                  Sign In with Google
                  <span></span>
                </button>
              </div>
            </form>
            <div className="mt-12 text-sm font-display font-semibold text-gray-700 text-center">
  Don't have an account ?{' '}
  <Link to="/sign-up" className="cursor-pointer text-indigo-600 hover:text-indigo-800">
    Sign up
  </Link>
</div>

          </div>
        </div>
      </div>
      <div
        style={{
          backgroundImage: 'url(../../static/landing-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: '10% center'
        }}
        className="hidden lg:flex items-center justify-center flex-1 h-screen"
      ></div>
    </div>
    </ThemeProvider>
  );
}

export default SigninForm;

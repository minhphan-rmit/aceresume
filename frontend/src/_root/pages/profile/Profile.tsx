import React from 'react';
import AppAppBar from "../../components/NavBar/AppAppBar";
import Button from '@mui/material/Button';
import { Avatar, Chip } from '@mui/material';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "../../../styles/getLPTheme";

// Sample user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+123456789",
  profilePic: "https://i.pravatar.cc/300", // Placeholder image service
  interests: ["Project Manager", "UI/UX Designer", "Full Stack Developer", "Data Scientist", "Machine Learning Engineer", "Software Engineer"],
};

const Profile = () => {
    const LPtheme = createTheme(getLPTheme());
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-indigo-500']; // Tailwind background colors for tags

    return (
      <ThemeProvider theme={LPtheme}>
        <AppAppBar />
        <div className="flex items-start justify-center w-screen h-screen p-10 space-x-6 bg-gray-100">
          <div className="flex flex-row items-center w-full gap-5 h-full p-20">
            <div id="personal-info" className="flex flex-col p-10 items-center h-full w-1/5 text-gray-700 bg-white rounded-lg shadow-lg">
              <Avatar src={userData.profilePic} sx={{ width: 150, height: 150 }} />
              <h2 className="mt-4 font-semibold text-lg">{userData.name}</h2>
              <p className="pt-4">{userData.email}</p>
              <p className="pt-4">{userData.phone}</p>
            </div>
            <div className="flex flex-col  items-start h-full  w-4/5 text-gray-700 bg-none ">
              <div className="flex flex-col items-center w-full gap-5 h-full">
                <div id="more-info" className="flex flex-col p-10 items-start h-3/5 w-full text-gray-700 bg-white rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Fields of Interest</h2>
                  <div className="flex flex-wrap gap-3">
                    {userData.interests.map((interest, index) => (
                      <Chip label={interest} className={`${colors[index % colors.length]} text-white mx-1 my-1`} key={index} />
                    ))}
                  </div>
                </div>
                <div id="more-actions" className="flex flex-col p-10 items-start h-2/5 w-full text-gray-700 bg-white rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-gray-700">Actions</h2>
                  <div className="flex flex-row justify-between w-full pt-5">
                  <Button variant="outlined" color="primary">Change your avatar</Button>
                    <Button variant="outlined" color="primary">Change your password</Button>
                    <Button variant="outlined">Change your username</Button>
                    <Button variant="contained">Log out</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
};

export default Profile;

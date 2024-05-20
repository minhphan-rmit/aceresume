import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppAppBar from "../../components/NavBar/AppAppBar";
import Button from '@mui/material/Button';
import { Avatar, Chip, Modal, Box, TextField, IconButton, InputAdornment, InputLabel, MenuItem, FormControl, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "../../../styles/getLPTheme";
import { Link } from 'react-router-dom';

const userImage = {
  profilePic: "https://i.pravatar.cc/300", // Placeholder image service
  interests: ["Project Manager", "UI/UX Designer", "Full Stack Developer", "Data Scientist", "Machine Learning Engineer", "Software Engineer"],
};

const Profile = () => {
  const LPtheme = createTheme(getLPTheme());
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setUserEmail] = useState('');
  const [level, setUserLevel] = useState('')
  const [number, setUserNumber] = useState('');
  const [password, setNewPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password_verify, setPasswordVerify] = useState('');
  const [new_password, setNewPassReset] = useState('');
  const [confirm_password, setConfirmPass] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showResetPassModal, setShowResetPassModal] = useState(false);
  const [showVerifyPasswordModal, setShowVerifyPasswordModal] = useState(false);
  const [userInterests, setInterests] = useState(userImage.interests);
  const [showAddInterestForm, setShowAddInterestForm] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [otp, setChangePassOTP] = useState('');
  const [tempOTP, setTempOTP ]= useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempNumber, setTempNumber] = useState('');
  const [tempLevel, setTempLevel] = useState('');
  const [tempPass, setTempPass] = useState('');

  const userId =localStorage.getItem('userId');
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(` https://ace-resume-backend-saahlmc6ha-as.a.run.app/api/aceresume/profile/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => { fetchUserProfile(); }, []);

  const handleForgotPass = () => {
    sentOTP();
    handleOpenOTPModal();
  }

  const handleLogOut = () => {
    localStorage.clear();
  }

  const sentOTP = async () => {
    try {
      const response = await axios.post(` https://ace-resume-backend-saahlmc6ha-as.a.run.app/api/aceresume/forgot_password/${userId}`);
      console.log('OTP sent successfully:', response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleCheckOTP = async () => {
    setTempOTP(otp);
    handleCloseOTPModal();
    setShowResetPassModal(true);
  }

  const handleProfileUpdate = async () => {
    setTempUsername(username);
    setTempEmail(email);
    setTempNumber(number);
    setTempLevel(level);
    setTempPass(password)

    handleCloseModal();
    setShowVerifyPasswordModal(true);
  };

  const handleVerifyPassword = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', tempUsername);
      formData.append('email', tempEmail);
      formData.append('number', tempNumber);
      formData.append('level', tempLevel);
      formData.append('password', tempPass);
      formData.append('password_verify', password_verify);

      const response = await axios.put(` https://ace-resume-backend-saahlmc6ha-as.a.run.app/api/aceresume/profile_update/${userId}`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log('Profile updated successfully:', response.data);
      setShowVerifyPasswordModal(false);
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('otp', tempOTP);
      formData.append('new_password', new_password);
      formData.append('confirm_password', confirm_password);

      const response = await axios.put(` https://ace-resume-backend-saahlmc6ha-as.a.run.app/api/aceresume/reset_password/${userId}`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log('Password reset successfully:', response.data);
      setShowResetPassModal(false);
      fetchUserProfile();
    } catch (error) {
      console.error('Error reset password:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleCancelVerifyPassword = () => {
    setShowVerifyPasswordModal(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setUserLevel(event.target.value);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenOTPModal = () => {
    setShowOTPModal(true);
  };
  const handleCloseOTPModal = () => {
    setShowOTPModal(false);
  };
  const handleToggleAddInterestForm = () => {
    setShowAddInterestForm(!showAddInterestForm);
  };

  const handleAddInterest = () => {
    if (newInterest.trim() !== '') {
      setInterests([...userInterests, newInterest.trim()]);
      setNewInterest('');
      setShowAddInterestForm(false); // Đóng form sau khi thêm thành công
    }
  };

  const handleRemoveInterest = (index) => {
    const updatedInterests = [...userInterests];
    updatedInterests.splice(index, 1);
    setInterests(updatedInterests);
  };

  return (
    <ThemeProvider theme={LPtheme}>
      <AppAppBar />
      <div className="flex items-start justify-center w-screen h-screen p-10 space-x-6 bg-gray-100">
        <div className="flex flex-row items-center w-full gap-5 h-full p-20">
          {userData && (
            <div id="personal-info" className="flex flex-col p-10 items-center h-full w-1/5 text-gray-700 bg-white rounded-lg shadow-lg px-3">
             <Box sx={{ width: 150, height: 150, flexShrink: 0, mr: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: "#6182FB", borderRadius: "50%" }}>
             <Typography fontWeight="500" sx={{ color: 'white', fontSize: '3rem' }}>
  {userData.username.charAt(0).toUpperCase()}
</Typography>
                </Box>

              <h2 className="mt-4 font-semibold text-lg w-full p-4 ">{userData.username}</h2>
              <p className=" w-full break-words p-4"><span className='font-bold'>Email: </span>{userData.email}</p>
              <p className="p-4">
  <span className="font-bold">Number: </span>
  {userData.number ?? 'No number available'}
</p>
              <p className="pt-4">{userData.level}</p>
            </div>
          )}
          <div className="flex flex-col  items-start h-full  w-4/5 text-gray-700 bg-none ">
            <div className="flex flex-col items-center w-full gap-5 h-full">
              <div id="more-info" className="flex flex-col p-10 items-start h-3/5 w-full text-gray-700 bg-white rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Fields of Interest</h2>
                <div className="flex flex-wrap gap-3">
                  {userInterests.map((item, index) => (
                    <Chip label={item} onDelete={() => handleRemoveInterest(index)} className="bg-blue-500 text-white mx-1 my-1" key={index} />
                  ))}
                  <Button variant="outlined" color="primary" onClick={handleToggleAddInterestForm}>Add Interest</Button>
                </div>
                {/* Render the add interest form if showAddInterestForm is true */}
                {showAddInterestForm && (
                  <div>
                    <TextField
                      label="New Interest"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      fullWidth
                    />
                    <Button variant="contained" onClick={handleAddInterest}>Add</Button>
                    <Button variant="outlined" onClick={handleToggleAddInterestForm}>Cancel</Button>
                  </div>
                )}
              </div>
              <div id="more-actions" className="flex flex-col p-10 items-start h-2/5 w-full text-gray-700 bg-white rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-gray-700">Actions</h2>
                <div className="flex flex-row justify-between w-full pt-5">
                  <Button variant="outlined" color="primary" onClick={handleOpenModal}>Update user profile</Button>
                  <Button variant="outlined" color="primary" onClick={handleForgotPass}>Change your password</Button>
                  <Link to="/sign-in">
                    <Button variant="contained" onClick={handleLogOut} >Log out</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Popup */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <h2 className="mb-4">Edit Profile</h2>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField label="New Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField label="New Email" value={email} onChange={(e) => setUserEmail(e.target.value)} />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField label="New Phone number" value={number} onChange={(e) => setUserNumber(e.target.value)} />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="demo-select-small-label">Level</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={level}
              label="Level"
              onChange={handleChange}
            >
              <MenuItem value={'beginner'}>Beginner</MenuItem>
              <MenuItem value={'intermediate'}>Intermediate</MenuItem>
              <MenuItem value={'advance'}>Advance</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setNewPass(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <Button variant="contained" onClick={handleProfileUpdate} fullWidth sx={{ mt: 2 }}>Save Changes</Button>
        </Box>
      </Modal>
      {/* Modal Popup for Password Verification */}
      <Modal open={showVerifyPasswordModal} onClose={handleCancelVerifyPassword}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <h2 className="mb-4">Verify Password</h2>
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password_verify}
            onChange={(e) => setPasswordVerify(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth />
          <Button variant="contained" onClick={handleVerifyPassword}>Confirm</Button>
          <Button variant="outlined" onClick={handleCancelVerifyPassword}>Cancel</Button>
        </Box>
      </Modal>
      {/* Modal OTP */}
      <Modal open={showOTPModal} onClose={handleCloseOTPModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <h2 className="mb-4">Verify OTP</h2>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField label="OTP" value={otp} onChange={(e) => setChangePassOTP(e.target.value)} />
          </FormControl>
          <Button variant="contained" onClick={handleCheckOTP} fullWidth sx={{ mt: 2 }}>Submit</Button>
        </Box>
      </Modal>
      {/* Modal Popup for Password Reset */}
      <Modal open={showResetPassModal} >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <h2 className="mb-4">Verify Password</h2>
          <TextField
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={new_password}
            onChange={(e) => setNewPassReset(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth />
          <TextField
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={confirm_password}
            onChange={(e) => setConfirmPass(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth />
          <Button variant="contained" onClick={handleResetPassword}>Confirm</Button>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default Profile;

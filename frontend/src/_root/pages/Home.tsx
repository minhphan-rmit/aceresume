import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppNavBar from "../components/NavBar/AppAppBar";
import Footer from "../components/Footer/Footer";
import axios from 'axios';
import { Link } from 'react-router-dom'
import FileUploadUtils from '../../config/FileUploadUtils'
import { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLPTheme } from '../../styles/getLPTheme';



const Home = () => {
  // State to store uploaded CVs
  const {
    uploadFile,
    selectedFile,
    setSelectedFile
  } = FileUploadUtils();
  const [uploadedCVs, setUploadedCVs] = useState([]);
  const [username, setUsername] = useState('');
  const userId = '663852ecd568222769540792';

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/aceresume/profile/${userId}`);
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const fetchAllCVs = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/aceresume/resume/${userId}/get_all_resume`);
      if (!response.ok) {
        throw new Error('Failed to fetch CVs');
      }
      const data = await response.json();

      setUploadedCVs(data);
    } catch (error) {
      console.error('Error fetching CVs:', error);
    }
  };

  // Fetch all CVs when the component mounts
  useEffect(() => {
    fetchAllCVs();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  const handleUpload = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
        alert('Please select a file to upload.');
        return;
    }

    uploadFile(
        (url: string) => {
            handleSubmit(url);  // This will now correctly handle the URL after it's available
        },
        (error: any) => {
            alert('Error uploading file: ' + error.message);
        }
      );
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
          setSelectedFile(file);


      }
  };

  const handleSubmit = async (url: string) => {
    if (!selectedFile) {
        alert('Please select a file to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('resume_url', url);

    try {
        const response = await axios.post(`http://localhost:8000/api/aceresume/resume/${userId}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        alert('Upload successful');
        localStorage.setItem('resumeId', response.data.object_id);
        fetchAllCVs();
    } catch (error) {
        console.error('Error uploading file:', error);
    }
  };

  const LPtheme = createTheme(getLPTheme());
  const navigate = useNavigate();


  const handleResumeClick = (resumeId: string, resumeUrl: string) => {

    localStorage.setItem('resumeId', resumeId);
   localStorage.setItem('uploadedFileUrl', resumeUrl);
    navigate('/cv-analysis?component=yourAnalysis&toggle=preview');

  }
  return (
    <ThemeProvider theme={LPtheme}>
      <AppNavBar />
      <Container  >
        <Box my={4}>
        <h1 className="text-3xl font-bold text-indigo-700 pt-16 pb-5">
        Nice to see you, {username}!
      </h1>
      <h2 className=" text-lg text-gray-400 italic">
        Today's a good day to analyze your resume ^^
      </h2>
          <Box className="flex my-4 w-full">
            <div className="w-1/2 flex gap-2">
  <Link to="/cv-analysis" >
    <Box className='shadow-lg  ' sx={{
        backgroundColor: "#a5b4fc",
        mr: 1,
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: 'center',
        color: "white",
        borderRadius: "10px",
        textAlign: "center",
        padding: 2,
        width:'200px',
        height:'200px'
      }}>
      <div className="pt-16 pb-5 text-2xl font-bold text-white ">Resume Analysis</div>
      <img style={{ height: "100px", width: "100px" }} src="https://firebasestorage.googleapis.com/v0/b/aceresume-d9997.appspot.com/o/assets%2FResume%20Illustration.png?alt=media&token=3c367f18-efa7-46a5-92a0-b7cd9508b325" alt="" />
    </Box>
  </Link>

  <Link to="/matching-jobs" >
    <Box className='shadow-lg  w-1/3' sx={{
        backgroundColor: "#B4F7C9",
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: 'center',
        color: "white",
        borderRadius: "10px",
        textAlign: "center",
        padding: 2,
        width:'200px',
        height:'200px'
      }}>
      <div  className="pt-20  text-2xl font-bold text-white ">Jobs </div>
      <div  className=" text-2xl font-bold text-white ">
      Finding</div>
      <img style={{ height: "200px", width: "200px", marginTop:'15px' }} src="https://firebasestorage.googleapis.com/v0/b/aceresume-d9997.appspot.com/o/assets%2Fjob-interview-2931986-2459038.png?alt=media&token=1ec826dc-c8a1-4ed6-958b-8ae0baaea066" alt="" />
    </Box>
  </Link>
</div>
  <div className='text-right w-1/2'>
  <h2 className="mt-5 text-3xl font-bold text-gray-900 justify-self-end flex items-center justify-evenly">
    <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.03429 5.96305L6.49114 8.49856C6.02369 8.9646 5.59488 9.3921 5.25624 9.77856C5.03877 10.0267 4.82145 10.2984 4.63737 10.5985L4.61259 10.5738C4.56555 10.5269 4.54201 10.5034 4.51839 10.4805C4.07636 10.0516 3.55641 9.71062 2.98636 9.47575C2.9559 9.4632 2.92498 9.45095 2.86314 9.42645L2.48449 9.27641C1.97153 9.07315 1.83482 8.41279 2.22514 8.02365C3.34535 6.90684 4.69032 5.56594 5.33941 5.29662C5.91185 5.05911 6.53023 4.98008 7.12664 5.06822C7.67311 5.14898 8.19006 5.42968 9.03429 5.96305Z" fill="#6366f1"></path> <path d="M13.3767 19.3132C13.5816 19.5212 13.7177 19.6681 13.8408 19.8251C14.0031 20.0322 14.1483 20.2523 14.2748 20.4829C14.4172 20.7426 14.5278 21.02 14.749 21.5748C14.929 22.0265 15.5272 22.1459 15.8746 21.7995L15.9586 21.7157C17.0788 20.5988 18.4237 19.2579 18.6938 18.6108C18.9321 18.04 19.0113 17.4235 18.9229 16.8289C18.8419 16.2841 18.5605 15.7688 18.0256 14.9273L15.474 17.4713C14.9959 17.9479 14.5576 18.385 14.1612 18.7273C13.9236 18.9325 13.6637 19.1376 13.3767 19.3132Z" fill="#6366f1"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4467 16.3769L20.2935 10.5476C21.1356 9.70811 21.5566 9.28836 21.7783 8.75458C22.0001 8.22081 22.0001 7.62719 22.0001 6.43996V5.87277C22.0001 4.04713 22.0001 3.13431 21.4312 2.56715C20.8624 2 19.9468 2 18.1157 2H17.5468C16.356 2 15.7606 2 15.2252 2.2211C14.6898 2.4422 14.2688 2.86195 13.4268 3.70146L7.57991 9.53078C6.59599 10.5117 5.98591 11.12 5.74966 11.7075C5.67502 11.8931 5.6377 12.0767 5.6377 12.2692C5.6377 13.0713 6.2851 13.7168 7.57991 15.0077L7.75393 15.1812L9.79245 13.1123C10.0832 12.8172 10.558 12.8137 10.8531 13.1044C11.1481 13.3951 11.1516 13.87 10.8609 14.1651L8.8162 16.2403L8.95326 16.3769C10.2481 17.6679 10.8955 18.3133 11.7 18.3133C11.8777 18.3133 12.0478 18.2818 12.2189 18.2188C12.8222 17.9966 13.438 17.3826 14.4467 16.3769ZM17.1935 9.5312C16.435 10.2874 15.2053 10.2874 14.4468 9.5312C13.6883 8.775 13.6883 7.54895 14.4468 6.79274C15.2053 6.03653 16.435 6.03653 17.1935 6.79274C17.952 7.54895 17.952 8.775 17.1935 9.5312Z" fill="#6366f1"></path> </g></svg>
    Launch Your Career Journey!
  </h2>
  <p className="mt-2 text-sm text-gray-400">
    Ready to take your career to new heights? Aceresume will guide you through a personalized journey to uncover your potential. Simply upload your resume, and let our system analyze your skills, suggest areas for improvement, and connect you with tailored job opportunities. Start building the career you deserve today!
  </p></div>
</Box>

          <div className="flex flex-row gap-4">
          <div className="w-1/5">
    <form onSubmit={handleUpload} className="mb-12 h-full">
      <div className="border-2 border-dashed border-indigo-300 rounded-lg p-5 text-center relative h-full flex flex-col justify-center">
        <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="text-base mb-2.5">
            Click here to upload your resume
          </div>
          {selectedFile &&
            <div className="text-sm text-gray-600 mb-2.5">
              Selected file: {selectedFile.name}
            </div>
          }
        </label>
        <button type="submit" className="mt-5 w-full flex justify-center bg-indigo-500 text-white py-4 rounded-full font-semibold focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300">
          Upload
        </button>
      </div>
    </form>
  </div>

      <div className="p-10 rounded-3xl shadow-lg w-4/5 ">
        <h2 className="text-2xl font-bold text-gray-600 pb-5">
          Your Resume
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 h-96 ">
          {uploadedCVs.map((cv, index) => (

            <div key={index} className="col-span-1 " onClick={() => handleResumeClick(cv.resume_id, cv.resume_url)}>
              <div className="p-2.5 rounded-lg shadow-md h-full cursor-pointer hover:bg-indigo-300  " style={{ transition: 'background-color 0.5s ease'}}>
                <iframe src={cv.resume_url} alt={cv.filename} className="h-80 w-full object-cover" />
                <p className="pt-2.5 text-indigo-500 font-semibold  text-sm whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {cv.filename}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

        </Box>
      </Container>
      <Footer />
    </ThemeProvider>
  );
}

export default Home;

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppNavBar from "../components/NavBar/AppAppBar";
import axios from 'axios';
import { Link } from 'react-router-dom'
import FileUploadUtils from '../../config/FileUploadUtils'
import { FormEvent, ChangeEvent } from 'react';
import CardMedia from '@mui/material/CardMedia';

const LPtheme = createTheme({
  typography: {
    fontFamily: [
      'Montserrat',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontFamily: 'Astralaga, serif',
    },
  },
});

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

  return (
    <ThemeProvider theme={LPtheme}>
      <AppNavBar />
      <Container>
        <Box my={4}>
          <Typography variant="h4" gutterBottom sx={{mb: 2}}>
            Nice to see you, {username}!
          </Typography>
          <Box sx={{ display: "flex", mb: 2 }}>
            <Link to="/mock-interview">
            <Box sx={{ backgroundColor: "#94C9FF", mr: 1, mb: 2, alignItems: "center", justifyContent: 'center', color: "white", borderRadius: "10px", textAlign: "center" }}>
              <div style={{ height: "150px", width: "150px" }}>Mock Interview</div>
            </Box>
            </Link>
            <Link to="/cv-analysis">
              <Box sx={{ backgroundColor: "#B494FF", mr: 1, mb: 2, alignItems: "center", justifyContent: 'center', color: "white", borderRadius: "10px", textAlign: "center" }}>
                <div style={{ height: "150px", width: "150px" }}>Resume Analysis</div>
              </Box>
            </Link>
            <Link to="/matching-jobs">
              <Box sx={{ backgroundColor: "#B4F7C9", mb: 2, alignItems: "center", justifyContent: 'center', color: "white", borderRadius: "10px", textAlign: "center" }}>
                <div style={{ height: "150px", width: "150px" }}>Jobs Finding</div>
              </Box>
            </Link>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper elevation={3} style={{ padding: 40, borderRadius: '30px' }}>
                <Typography variant="h5" gutterBottom style={{ marginBottom: 20 }}>
                  Your Resume
                </Typography>
                {/* <form onSubmit={handleUpload} style={{ marginBottom: 50 }}>
                  <Box sx={{
                    border: '2px dashed #7682FB',
                    borderRadius: '10px',
                    padding: '20px',
                    textAlign: 'center',
                    position: 'relative'
                  }}>
                    <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
                    <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                      <Typography variant="subtitle1" gutterBottom style={{ marginBottom: 10 }}>
                        Click here to upload your resume
                      </Typography>
                      {selectedFile && <Typography variant="body2" gutterBottom style={{ color: '#666' }}>Selected file: {selectedFile.name}</Typography>}
                    </label>
                    <button type="submit" className="my-5 w-full flex justify-center bg-indigo-500 text-gray-100 p-4  rounded-full tracking-wide
                                    font-semibold  focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300">
                        Upload
                    </button>
                  </Box>
                </form> */}
                <Grid container spacing={2}>
                  {/* Render each uploaded CV */}
                  {uploadedCVs.map((cv, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper elevation={3} style={{ padding: 10, borderRadius: "10px" }}>
                        <CardMedia
                            component="img"
                            height="80"
                            image={cv.resume_url}
                            alt={cv.filename}
                          />
                        <Typography style={{paddingTop: 10, color: '#6182FB', fontWeight: '300', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cv.filename}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Home;

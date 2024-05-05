import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Grid, Paper, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "../../styles/getLPTheme";
import AppNavBar from "../components/NavBar/AppAppBar";
import { Document, Page } from 'react-pdf';
import pdf from "../../../../backend/services/Huy_VO_s_CV_FPT.pdf"


const LPtheme = createTheme(getLPTheme());

const Home = () => {
  // State to store uploaded CVs
  const [uploadedCVs, setUploadedCVs] = useState([]);
  const [pdfBuffer, setPdfBuffer] = useState(null);

  const fetchAllCVs = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/aceresume/resume/661cd5605bab1b3e43385984/get_all_resume`);
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

  return (
    <ThemeProvider theme={LPtheme}>
      <AppNavBar />
      <Container>
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom sx={{mb: 2}}>
            Nice to see you, Danni!
          </Typography>
          <Box sx={{ display: "flex", mb: 2 }}>
            <Box sx={{ height: "150px", width: "150px", backgroundColor: "#94C9FF", mr: 1, mb: 2, alignItems: "center", justifyContent: 'center', color: "white", borderRadius: "10px" }}>LinkedIn</Box>
            <Box sx={{ height: "150px", width: "150px", backgroundColor: "#B494FF", mr: 1, mb: 2, alignItems: "center", justifyContent: 'center', color: "white", borderRadius: "10px" }}>Resume Analysis</Box>
            <Box sx={{ height: "150px", width: "150px", backgroundColor: "#B4F7C9", mr: 1, mb: 2, alignItems: "center", justifyContent: 'center', color: "white", borderRadius: "10px" }}>Jobs Finding</Box>
          </Box>
          <Grid container spacing={2}>
            {/* Render each uploaded CV */}
            {uploadedCVs.map((cv, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={3} style={{ padding: 10 }}>
                  <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                    {cv.filename}
                  </Typography>
                </Paper>
              </Grid>
            ))}
              <iframe src={pdf} width="100%" height="500px" frameBorder="0"></iframe>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Home;

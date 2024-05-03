import React, { useState } from 'react';
import { Box, Button, Container, Typography, Grid, Paper, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "../../styles/getLPTheme";
import AppNavBar from "../components/NavBar/AppAppBar";
import { Delete as DeleteIcon } from '@mui/icons-material';

const LPtheme = createTheme(getLPTheme());

const Home = () => {
  // State to store uploaded CVs
  const [uploadedCVs, setUploadedCVs] = useState([]);

  // Function to handle uploading a new CV
  const handleUploadCV = (event) => {
    const newCV = event.target.files[0];
    setUploadedCVs([...uploadedCVs, newCV]);
  };

  // Function to handle deleting a CV
  const handleDeleteCV = (index) => {
    const updatedCVs = [...uploadedCVs];
    updatedCVs.splice(index, 1);
    setUploadedCVs(updatedCVs);
  };

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
                    {cv.name}
                  </Typography>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteCV(index)}
                    style={{ position: 'absolute', top: 5, right: 5 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
          {/* Component for uploading new CV */}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleUploadCV}
            style={{ display: 'none' }}
            id="upload-button"
          />
          <label htmlFor="upload-button">
            <Button variant="contained" color="primary" component="span">
              Upload CV
            </Button>
          </label>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Home;

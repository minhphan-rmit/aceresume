import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import AppNavBar from '../../components/NavBar/AppAppBar';
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { indigo } from "@mui/material/colors";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from "@mui/material/Modal";
import { Grid, Paper, CardMedia, InputLabel } from '@mui/material';
import getLPTheme from "../../../styles/getLPTheme";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const LPtheme = createTheme(getLPTheme());
const randomColor = () => {
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b'];
  return colors[Math.floor(Math.random() * colors.length)];
};


function MatchedJobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("USA");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [uploadedCVs, setUploadedCVs] = useState([]);
  const userId = localStorage.getItem('userId');
  const [selectedCV, setSelectedCV] = useState("");
  const [temporaryResumeId, setTemporaryResumeId] = useState(null);

  useEffect(() => {
    // Set the first job when jobs array updates
    if (selectedJob === null && jobs.length > 0) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const fetchAllCVs = async () => {
    try {
      const response = await fetch(` https://ace-resume-backend-7fotus647q-as.a.run.app/api/aceresume/resume/${userId}/get_all_resume`);
      if (!response.ok) {
        throw new Error('Failed to fetch CVs');
      }
      const data = await response.json();
      setUploadedCVs(data);
    } catch (error) {
      console.error('Error fetching CVs:', error);
    }
  };

  const handleAddCVButtonClick = () => {
    setOpenModal(true);
    fetchAllCVs();
  };

  const handleCVSelect = (cv) => {
    setTemporaryResumeId(cv.resume_id);
    setSelectedCV(cv);
    setOpenModal(false);
  };
  useEffect(() => {
    console.log("Resume ID:", temporaryResumeId);
  }, [temporaryResumeId]);

  const handleJobCardClick = (job) => {
    setSelectedJob(job);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(` https://ace-resume-backend-7fotus647q-as.a.run.app/api/aceresume/job/${encodeURIComponent(searchQuery)}/find-jobs?user_id=${userId}&resume_id=${temporaryResumeId}&location=${selectedLocation}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setJobs(data.list_of_jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={LPtheme}>
      <AppNavBar />

      <Container sx={{ py: 4 }}>
        <div className="flex justify-between gap-6">
       <div className="flex flex-col w-4/5 gap-8">
        <div className="flex flex-col items-start ">
      <Typography
        variant="h5"
        sx={{ fontSize: "50px", fontWeight: "bold", textAlign: "right" }}
      >
        Top <span style={{ color: indigo[500] }}>Picked Jobs</span>
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", mb: 3, textAlign: "right" }}
      >
        Explore the top trending jobs handpicked just for you based on your
        skills and interests.
      </Typography>
      </div>


        <Box mb={3} sx={{ position: 'relative'}} className=" flex gap-3 w-3/4">
          <TextField
            label="Search Jobs"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">

                  <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                    value={selectedLocation}
                    onChange={handleLocationChange}

                    displayEmpty
                    sx={{ minWidth: 120 }}
                    className="border-none"
                  >
                    <MenuItem value="" disabled>
                      Select Location
                    </MenuItem>
                    <MenuItem value="Canada">Canada</MenuItem>
                    <MenuItem value="USA">USA</MenuItem>
                    <MenuItem value="Vietnam">Vietnam</MenuItem>
                    <MenuItem value="Japan">Japan</MenuItem>
                    <MenuItem value="UK">UK</MenuItem>
                    {/* Add more locations as needed */}
                  </Select>

                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" onClick={handleSearch}>
                    Search
                  </Button>
        </Box>

</div>
<div className="w-1/5">
        <Button variant="contained" onClick={handleAddCVButtonClick} sx={{my: 2, width: '100%'}}>
            Use data from CV
        </Button>
        <div className="border-2 border-dashed border-indigo-300 rounded-lg  text-center relative h-min p-3 w-full  flex flex-col justify-center items-center">
{!selectedCV && <div className="text-gray-500 font-light italic"> No resume data used</div>}

          {selectedCV && (
            <Paper style={{ padding: 5, borderRadius: "10px", width: 150, maxHeight: 250 }}>
              <CardMedia
                  component="img"
                  height="30"
                  image={selectedCV.resume_url}
                  alt={selectedCV.filename}
                />
              <Typography style={{paddingTop: 10, color: '#6182FB', fontWeight: '300', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedCV.filename}
              </Typography>
            </Paper>
          )}

        </div>
        </div>
</div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openModal}
          onClose={() => setOpenModal(false)}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 500,
              maxHeight: 500,
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 4,
              p: 2,
              overflowY: 'auto',
            }}
          >
            <Typography variant="h5" id="modal-modal-title" sx={{fontFamily:'Montserrat, sans-serif', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
              Uploaded Resumes
            </Typography>
            <Grid container spacing={2}>
              {/* Render each uploaded CV */}
              {uploadedCVs.map((cv, index) => (
                <Grid item xs={12} sm={6} md={4} key={index} onClick={() => handleCVSelect(cv)}>
                  <Paper elevation={3} style={{ padding: 10, borderRadius: "10px"}}>
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
          </Box>
        </Modal>
        <Typography
          variant="h4"
          sx={{
            fontSize: "25px",
            color: indigo[500],
            mb: 2,
            textAlign: "center",
          }}
        >
          Matched Jobs
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
            <CircularProgress sx={{ mr: 2 }} />
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ flex: '1 1 0', maxHeight: '100vh', overflow: 'auto' }}>
              {jobs.map((job, index) => (
                <Card key={index} onClick={() => handleJobCardClick(job)} sx={{ cursor: 'pointer', backgroundImage: 'linear-gradient(to bottom, #E8EAFF, #FFFFFF, #FFFFFF)', border: selectedJob === job ? '2px solid #7682FB' : '2px solid transparent', mb: 2}}>
                  <CardContent>
                      <Box sx={{display: 'flex'}}>
                        {job.logo_photo_url !== "None" ? (
                          <Box sx={{ width: 50, height: 50, flexShrink: 0, mr: 1 }}>
                            <img src={job.logo_photo_url} style={{borderRadius: "5px"}}/>
                          </Box>
                        ) : (
                          <Box sx={{ width: 50, height: 50, flexShrink: 0, mr: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: randomColor(), borderRadius: "5px" }}>
                            <Typography fontWeight="500" sx={{ color: 'white', fontSize: '20px' }}>{job.company.charAt(0)}</Typography>
                          </Box>
                        )}
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: "14px", mb: 0.5, fontWeight: "bold" }}
                          >
                            {job.job_title}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: "14px", mb: 2}}>
                            {job.company}
                          </Typography>
                        </Box>
                      </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        mb: 2,
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      <Chip
                        label={job.location}
                        color="primary"
                        sx={{ borderRadius: "4px", bgcolor: "#D0D7FF"}}
                      />
                      {job.job_type !== "None" && (
                        <Chip
                          label={job.job_type}
                          color="secondary"
                          sx={{ borderRadius: "4px", bgcolor: "#D0D7FF"}}
                        />
                      )}
                      {job.is_remote === true && (
                        <Chip
                          label="Remote"
                          color="secondary"
                          sx={{ borderRadius: "4px", bgcolor: "#D0D7FF"}}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, maxHeight: 58, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
                      <div dangerouslySetInnerHTML={{ __html: job.job_description.replace(/### (.*?)(?:\n|$)/g, "<h3>$1</h3>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>").replace(/\* /g, "&#8226; ") }} />
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", fontSize: '12px' }}>
                        <MonetizationOnIcon sx={{ mr: 0.5, fontSize: "small", color: 'grey' }} />
                        {job.min_amount === "None" && job.max_amount === "None" ? (
                          'Not listed'
                        ): job.min_amount === job.max_amount ? (
                          `$${parseFloat(job.max_amount).toLocaleString('en-US')}`
                        ):(
                          `$${parseFloat(job.min_amount).toLocaleString('en-US')} to $${parseFloat(job.max_amount).toLocaleString('en-US')}`
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ mb: 2, color: 'grey', fontSize: '12px' }}>
                        {job.date_posted}
                      </Typography>
                        <a href={job.job_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="contained" endIcon={<ArrowForwardIcon />}>
                            Apply Now
                          </Button>
                        </a>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
            <Box sx={{ flex: '0 0 auto', maxHeight: '100vh', width: 400, overflow: 'auto' }}>
              {selectedJob && (
                <Card sx={{ p: 2 }}>
                  <Typography variant="body1" sx={{ color: "#3f54be", fontWeight: "bold", mb: 1}}>{selectedJob.job_title}</Typography>
                  <Typography variant="h6" sx={{ color: "grey", mb: 2}}>{selectedJob.company}</Typography>
                  <Typography variant="body2">
                    <div dangerouslySetInnerHTML={{ __html: selectedJob.job_description.replace(/### (.*?)(?:\n|$)/g, "<h3>$1</h3>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>").replace(/\* /g, "&#8226; ") }} />
                  </Typography>
                </Card>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default MatchedJobs;

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
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
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
  const [selectedLocation, setSelectedLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoritedJobs, setFavoritedJobs] = useState([]);

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

  const handleJobCardClick = (job) => {
    setSelectedJob(job);
  };

  const toggleFavorite = (job) => {
    if (favoritedJobs.includes(job)) {
      setFavoritedJobs(favoritedJobs.filter((favJob) => favJob !== job));
    } else {
      setFavoritedJobs([...favoritedJobs, job]);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true); // Set loading to true when search button is clicked
      const response = await fetch(`http://localhost:8000/api/aceresume/job/${searchQuery}/find-jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job_title: searchQuery }),
      });
      const data = await response.json();
      setJobs(data.list_of_jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false); // Set loading to false when response is received
    }
  };

  return (
    <ThemeProvider theme={LPtheme}>
      <AppNavBar />
      <Container sx={{ py: 4 }}>
        <Box mb={3} sx={{ position: 'relative'}}>
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
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    variant="outlined"
                    displayEmpty
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="" disabled>
                      Select Location
                    </MenuItem>
                    <MenuItem value="San Francisco, CA">San Francisco, CA</MenuItem>
                    <MenuItem value="Austin, TX">Austin, TX</MenuItem>
                    {/* Add more locations as needed */}
                  </Select>
                  <Button variant="contained" onClick={handleSearch}>
                    Search
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>
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
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
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
                      {favoritedJobs.includes(job) ? (
                          <FavoriteIcon color="error" onClick={(e) => { e.stopPropagation(); toggleFavorite(job); }} />
                        ) : (
                          <FavoriteBorderIcon onClick={(e) => { e.stopPropagation(); toggleFavorite(job); }} />
                      )}
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
                          sx={{ borderRadius: "4px" }}
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

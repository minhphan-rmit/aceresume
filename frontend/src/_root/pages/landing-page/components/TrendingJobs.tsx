import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Divider from "@mui/material/Divider";
import { indigo } from "@mui/material/colors";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const randomColor = () => {
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b'];
  return colors[Math.floor(Math.random() * colors.length)];
};

function TrendingJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_BASE_URL}/job/find-jobs-available`, {
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
      }
    };

    fetchJobs();
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontSize: "25px",
          color: indigo[500],
          mb: 2,
          textAlign: "center",
        }}
      >
        Trending Jobs
      </Typography>
      <Typography
        variant="h5"
        sx={{ fontSize: "50px", fontWeight: "bold", textAlign: "center" }}
      >
        Top <span style={{ color: indigo[500] }}>Picked Jobs</span>
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", mb: 3, textAlign: "center" }}
      >
        Explore the top trending jobs handpicked just for you based on your
        skills and interests.
      </Typography>
      <Grid container spacing={3}>
        {jobs.map((job, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ cursor: 'pointer', backgroundImage: 'linear-gradient(to bottom, #E8EAFF, #FFFFFF, #FFFFFF)', mb: 2}}>
              <CardContent>
                <Box sx={{display: 'flex'}}>
                  {job.logo_photo_url !== "None" ? (
                    <Box sx={{ width: 50, height: 50, flexShrink: 0, mr: 1 }}>
                      <img src={job.logo_photo_url} style={{borderRadius: "5px"}} alt="logo"/>
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
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default TrendingJobs;

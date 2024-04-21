import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded"; // For CV Analysis
import VideoCallRoundedIcon from "@mui/icons-material/VideoCallRounded"; // For Mock Interviews
import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded"; // For Real-time Feedback
import WorkRoundedIcon from "@mui/icons-material/WorkRounded"; // For Job Matching
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded"; // For Support

const items = [
  {
    icon: <AssessmentRoundedIcon />,
    title: "Detailed CV Analysis",
    description:
      "Utilize advanced algorithms to analyze and optimize your CV, ensuring you highlight the skills that matter most.",
  },
  {
    icon: <VideoCallRoundedIcon />,
    title: "Realistic Mock Interviews",
    description:
      "Engage in simulated interviews with our AI-driven system to practice and perfect your interview techniques.",
  },
  {
    icon: <FeedbackRoundedIcon />,
    title: "Instant Feedback",
    description:
      "Receive immediate, actionable feedback on your interview performance to rapidly improve your skills.",
  },
  {
    icon: <WorkRoundedIcon />,
    title: "Smart Job Matching",
    description:
      "Get matched with job opportunities that fit your profile and preparation, making your job search smarter and more targeted.",
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: "24/7 Expert Support",
    description:
      "Access around-the-clock support from career experts to answer your questions and guide you through your job search journey.",
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "#06090a",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Typography component="h2" variant="h4" textAlign="center">
          Ace your interviews with our tools
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "grey.400", textAlign: "center" }}
        >
          Discover our project’s cutting-edge tools designed for comprehensive
          interview preparation: from CV optimization to real-time practice
          sessions.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {items.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                  height: "100%",
                  width: "100%",
                  maxWidth: 345, // Set a max width for each card for better visual consistency
                  border: "1px solid",
                  borderColor: "grey.800",
                  background: "transparent",
                  backgroundColor: "grey.900",
                }}
              >
                <Box sx={{ opacity: 0.6 }}>{item.icon}</Box>
                <Typography fontWeight="medium" gutterBottom component="div">
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "grey.400", textAlign: "center" }}
                >
                  {item.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

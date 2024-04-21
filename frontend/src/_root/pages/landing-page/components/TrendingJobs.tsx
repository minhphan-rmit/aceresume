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

const jobs = [
  {
    title: "Senior Software Developer",
    category: "Developer",
    type: "Full-time",
    description:
      "Develop high-quality software design and architecture. Identify, prioritize and execute tasks in the software development lifecycle.",
    location: "New York, NY",
    salary: "$120k - $150k",
    companyName: "TechSphere",
    companyLogo: "/static/images/logo1.png",
  },
  {
    title: "Product Designer",
    category: "UI/UX",
    type: "Remote",
    description:
      "Create user-centered designs by understanding business requirements, the voice of the customer, user journeys, customer feedback.",
    location: "Remote",
    salary: "$95k - $120k",
    companyName: "DesignPro",
    companyLogo: "/static/images/logo2.png",
  },
  {
    title: "Product Designer",
    category: "UI/UX",
    type: "Remote",
    description:
      "Create user-centered designs by understanding business requirements, the voice of the customer, user journeys, customer feedback.",
    location: "Remote",
    salary: "$95k - $120k",
    companyName: "DesignPro",
    companyLogo: "/static/images/logo2.png",
  },
  {
    title: "Product Designer",
    category: "UI/UX",
    type: "Remote",
    description:
      "Create user-centered designs by understanding business requirements, the voice of the customer, user journeys, customer feedback.",
    location: "Remote",
    salary: "$95k - $120k",
    companyName: "DesignPro",
    companyLogo: "/static/images/logo2.png",
  },
  {
    title: "Product Designer",
    category: "UI/UX",
    type: "Remote",
    description:
      "Create user-centered designs by understanding business requirements, the voice of the customer, user journeys, customer feedback.",
    location: "Remote",
    salary: "$95k - $120k",
    companyName: "DesignPro",
    companyLogo: "/static/images/logo2.png",
  },
  {
    title: "Product Designer",
    category: "UI/UX",
    type: "Remote",
    description:
      "Create user-centered designs by understanding business requirements, the voice of the customer, user journeys, customer feedback.",
    location: "Remote",
    salary: "$95k - $120k",
    companyName: "DesignPro",
    companyLogo: "/static/images/logo2.png",
  },
];

export default function TrendingJobs() {
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
            <Card>
              <CardContent>
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
                    label={job.category}
                    color="primary"
                    sx={{ borderRadius: "4px" }}
                  />
                  <Chip
                    label={job.type}
                    color="secondary"
                    sx={{ borderRadius: "4px" }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "20px", fontWeight: "bold", mb: 1 }}
                >
                  {job.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {job.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOnIcon sx={{ mr: 0.5 }} />
                    {job.location}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AttachMoneyIcon sx={{ mr: 0.5 }} />
                    {job.salary}
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
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="img"
                      src={job.companyLogo}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {job.companyName}
                    </Typography>
                  </Box>
                  <Button variant="contained" endIcon={<ArrowForwardIcon />}>
                    Apply Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

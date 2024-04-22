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
      title: "Full Stack Developer",
      category: "Software",
      type: "Full-time",
      description: "Participate in the entire app lifecycle, focusing on coding and debugging. Write clean code to develop functional web applications.",
      location: "San Francisco, CA",
      salary: "$115k - $140k",
      companyName: "DevTech",
      companyLogo: "/static/images/devtech_logo.png",
    },
    {
      title: "Marketing Coordinator",
      category: "Marketing",
      type: "Part-time",
      description: "Implement marketing and advertising campaigns by assembling and analyzing sales forecasts. Prepare marketing reports by collecting and summarizing sales data.",
      location: "Austin, TX",
      salary: "$40k - $50k",
      companyName: "MarketGurus",
      companyLogo: "/static/images/marketgurus_logo.png",
    },
    {
      title: "Data Analyst",
      category: "Data",
      type: "Remote",
      description: "Interpret data, analyze results using statistical techniques and provide ongoing reports. Develop and implement databases, data collection systems.",
      location: "Remote",
      salary: "$70k - $90k",
      companyName: "DataWiz",
      companyLogo: "/static/images/datawiz_logo.png",
    },
    {
      title: "Human Resources Manager",
      category: "HR",
      type: "Full-time",
      description: "Develop and implement HR strategies and initiatives aligned with the overall business strategy. Bridge management and employee relations.",
      location: "New York, NY",
      salary: "$95k - $120k",
      companyName: "PeopleFirst",
      companyLogo: "/static/images/peoplefirst_logo.png",
    },
    {
      title: "UX/UI Designer",
      category: "Design",
      type: "Freelance",
      description: "Gather and evaluate user requirements in collaboration with product managers and engineers. Illustrate design ideas using storyboards, process flows, and sitemaps.",
      location: "Remote",
      salary: "$50 per hour",
      companyName: "CreativeSolutions",
      companyLogo: "/static/images/creativesolutions_logo.png",
    },
    {
      title: "Sales Executive",
      category: "Sales",
      type: "Full-time",
      description: "Drive sustainable financial growth through boosting sales and forging strong relationships with clients. Identify emerging markets and market shifts.",
      location: "Chicago, IL",
      salary: "$80k - $100k",
      companyName: "SalesDrive",
      companyLogo: "/static/images/salesdrive_logo.png",
    }
  ];

function MatchedJobs() {
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
        Matched Jobs
      </Typography>
      <Typography
        variant="h5"
        sx={{ fontSize: "35px", fontWeight: "bold", textAlign: "center" }}
      >
        Recommended <span style={{ color: indigo[500] }}>Based On Your Interview</span>
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", mb: 3, textAlign: "center" }}
      >
        Explore the top job opportunities tailored to your recent performance and interview skills.
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

export default MatchedJobs;

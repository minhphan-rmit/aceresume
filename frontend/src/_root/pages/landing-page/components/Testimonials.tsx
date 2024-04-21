import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import { yellow, indigo, grey } from "@mui/material/colors";

const userTestimonials = [
  {
    avatar: <Avatar alt="Phuong Tran" src="/static/images/avatar/1.jpg" />,
    name: "Phuong Tran",
    occupation: "Job Seeker",
    testimonial:
      "The interview practice tool was a game changer—realistic simulations with AI helped me prepare confidently for tough interview questions. I felt ready and composed for my actual interviews!",
    rating: 5,
  },
  {
    avatar: <Avatar alt="Huy Vo" src="/static/images/avatar/2.jpg" />,
    name: "Huy Vo",
    occupation: "Recent Graduate",
    testimonial:
      "I landed my first job using this platform. The job matching feature accurately suggested roles that fit my skills and career aspirations. Highly recommend for any new graduates looking for guidance!",
    rating: 4,
  },
  {
    avatar: <Avatar alt="Doan Nguyen" src="/static/images/avatar/3.jpg" />,
    name: "Doan Nguyen",
    occupation: "Aspiring Manager",
    testimonial:
      "This tool helped me step up from an entry-level position by preparing me for managerial role interviews. The detailed feedback and resources are top-notch!",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <Container
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        sx={{ fontSize: "25px", color: indigo[500] }}
      >
        Testimonials
      </Typography>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontSize: "50px", fontWeight: "bold", mt: 1, mb: 1 }}
      >
        Our Client <span style={{ color: indigo[500] }}>Testimonials</span>
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Hear from users who've successfully navigated their job interviews with
        our tools. Discover their stories of preparation, practice, and success.
      </Typography>
      <Grid container spacing={2}>
        {userTestimonials.map((testimonial, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                maxWidth: 345,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <CardHeader
                avatar={testimonial.avatar}
                title={
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ fontSize: "20px", color: indigo[500] }}
                  >
                    {testimonial.name}
                  </Typography>
                }
                subheader={
                  <Typography variant="caption" display="block" sx={{ mt: -1 }}>
                    {testimonial.occupation}
                  </Typography>
                } // Reduce margin-top to tighten the space
                sx={{ paddingBottom: 0 }}
              />
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: yellow[700] }} />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: grey[300] }} />
                  ))}
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Customer Review
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {testimonial.testimonial}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

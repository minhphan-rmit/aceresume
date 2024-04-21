import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import CloseIcon from "@mui/icons-material/Close"; // Using CloseIcon as 'X'

const logoStyle = {
  width: "100px",
  height: "auto",
};

export function ContactSection() {
  return (
    <Box
      sx={{
        flex: 1,
        p: 1,
        textAlign: "center", // Center aligning all text
      }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        Contact Us
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 1,
        }}
      >
        <EmailIcon sx={{ mr: 1 }} />
        <Link href="mailto:support@aceresume.com" color="inherit">
          support@aceresume.com
        </Link>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 1,
        }}
      >
        <PhoneIcon sx={{ mr: 1 }} />
        <Link href="tel:+1234567890" color="inherit">
          +84 907 459 988
        </Link>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 1,
        }}
      >
        <LocationOnIcon sx={{ mr: 1 }} />
        <Typography variant="body2">
          702 Nguyen Van Linh District 7, Ho Chi Minh City
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 2,
        }}
      >
        <Link href="https://github.com/" target="_blank" color="inherit">
          <GitHubIcon />
        </Link>
        <Link href="https://www.facebook.com/" target="_blank" color="inherit">
          <FacebookIcon />
        </Link>
        <Link href="https://example.com/" target="_blank" color="inherit">
          <CloseIcon />
        </Link>
      </Box>
    </Box>
  );
}

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" mt={1}>
      {"Copyright © "}
      <Link href="https://mui.com/">AceResume | Ace Your Career</Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 },
        py: { xs: 8, sm: 10 },
        textAlign: "center",
      }}
    >
      <Box
        component="img"
        src="/static/aceresume_logo.svg"
        alt="AceResume Logo"
        sx={logoStyle}
      />
      <Typography
        variant="h4" // Making the text larger
        gutterBottom
        sx={{
          fontWeight: "bold", // Making the text bold
          color: "text.primary", // Ensures the non-highlighted text uses the primary text color
          "& span": {
            color: "indigo", // Applies indigo color to the "AceResume" part
          },
        }}
      >
        <span>AceResume</span> | Ace Your Career
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Quick Links
          </Typography>
          <Link color="text.secondary" href="#" sx={{ display: "block" }}>
            Features
          </Link>
          <Link color="text.secondary" href="#" sx={{ display: "block" }}>
            Testimonials
          </Link>
          <Link color="text.secondary" href="#" sx={{ display: "block" }}>
            Highlights
          </Link>
          <Link color="text.secondary" href="#" sx={{ display: "block" }}>
            Pricing
          </Link>
          <Link color="text.secondary" href="#" sx={{ display: "block" }}>
            FAQs
          </Link>
        </Box>
        <ContactSection />
        <Box
          sx={{
            flex: 1,
            p: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Newsletter
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Subscribe to our newsletter for updates and promotions.
          </Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              id="newsletter-email"
              hiddenLabel
              size="small"
              variant="outlined"
              fullWidth
              aria-label="Enter your email address"
              placeholder="Your email address"
              inputProps={{
                autoComplete: "off",
              }}
            />
            <Button variant="contained" color="primary">
              Subscribe
            </Button>
          </Stack>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          pt: { xs: 4, sm: 8 },
          borderTop: "1px solid",
          borderColor: "divider",
          mt: 3,
        }}
      >
        <Box>
          <Link color="text.secondary" href="#">
            Privacy Policy
          </Link>
          <Typography display="inline" sx={{ mx: 0.5, opacity: 0.5 }}>
            •
          </Typography>
          <Link color="text.secondary" href="#">
            Terms of Service
          </Link>
        </Box>
        <Copyright />
      </Box>
    </Container>
  );
}

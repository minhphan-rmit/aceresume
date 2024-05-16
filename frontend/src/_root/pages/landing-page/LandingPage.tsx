import React, { useRef } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import AppAppBar from "../../components/NavBar/AppAppBar";
// import Hero from "./components/Hero";
import LogoCollection from "./components/LogoCollection";
import Highlights from "./components/Highlights";
import Pricing from "./components/Pricing";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import getLPTheme from "../../../styles/getLPTheme";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TrendingJobs from "./components/TrendingJobs";
import { Link, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function LandingPage() {
  const LPtheme = createTheme(getLPTheme());
  const emailRef = useRef(null);
  const navigate = useNavigate();

  const handleStartNow = () => {
    const email = emailRef.current.value;
    navigate('/sign-up',{state:{email}});
    console.log(email);
  };

  return (
    <ThemeProvider theme={LPtheme}>

      <CssBaseline />
      <AppAppBar />
      <Box
        id="hero"
        sx={() => ({
          width: '100%',
          backgroundImage: 'linear-gradient(180deg, #3F51B5, #FFF)',
          backgroundSize: '100% 70%',
          backgroundRepeat: 'no-repeat',
        })}
      >
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 14, sm: 20 },
            pb: { xs: 8, sm: 12 },
          }}
        >
          <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
            <Typography
              variant="h1"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 'clamp(3.5rem, 10vw, 4rem)',
              }}
            >
              Get Hired&nbsp;
              <Typography
                component="span"
                variant="h1"
                sx={{
                  fontSize: 'clamp(3rem, 10vw, 4rem)',
                  color: (theme) =>
                    theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                }}
              >
                Faster
              </Typography>
            </Typography>
            <Typography
              textAlign="center"
              color="text.secondary"
              sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
            >
              'Master the art of interviewing with our comprehensive preparation platform. Access tailored question banks, real-time feedback, and expert coaching to enhance your interviewing skills and discover top talent.'
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignSelf="center"
              spacing={1}
              useFlexGap
              sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
            >
              <TextField
                inputRef={emailRef}
                id="outlined-basic"
                hiddenLabel
                size="small"
                variant="outlined"
                aria-label="Enter your email address"
                placeholder="Your email address"
                inputProps={{
                  autoComplete: 'off',
                  ariaLabel: 'Enter your email address',
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartNow}
              > Start now
              </Button>
            </Stack>
            <Typography variant="caption" textAlign="center" sx={{ opacity: 0.8 }}>
              By clicking &quot;Start now&quot; you agree to our&nbsp;
              <Link href="#" color="primary">
                Terms & Conditions
              </Link>
              .
            </Typography>
          </Stack>
        </Container>
      </Box>
      <Box sx={{ bgcolor: "background.default" }}>
        <LogoCollection />
        <Features />
        <Divider />
        <TrendingJobs />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

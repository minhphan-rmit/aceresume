import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { alpha } from '@mui/material';

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <Container sx={{ py: { xs: 8, sm: 12 } }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Zone: Title, Paragraph, Button */}
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h2"
              sx={{ mb: 2, fontSize: 'clamp(2rem, 5vw, 3rem)', textAlign: 'left' }}
            >
              Our Latest Products
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 2, color: 'text.secondary', textAlign: 'left' }}
            >
              Explore our cutting-edge dashboard, delivering high-quality solutions
              tailored to your needs. Elevate your experience with top-tier features
              and services.
            </Typography>
            <Button variant="contained" color="primary">
              Get Started
            </Button>
          </Grid>

          {/* Right Zone: SVG Image */}
          <Grid item xs={12} sm={6}>
            <Box
              component="img"
              sx={{
                height: 'auto',
                width: '100%',
                maxHeight: { xs: 233, sm: 500 },
                maxWidth: { sm: 350, md: 500 },
              }}
              alt="Your SVG image description"
              src="/path/to/your/image.svg" // Update the path to your SVG image
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

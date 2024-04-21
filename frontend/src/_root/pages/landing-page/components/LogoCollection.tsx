import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const darkLogos = [
  "/brand/itviec_logo.svg",
  "/brand/momo_logo.svg",
  "/brand/rmit_logo.svg",
  "/brand/vietnamworks_logo.svg",
  "/brand/vng_logo.svg",
];

const logoStyle = {
  width: "100px",
  height: "80px",
  margin: "0 32px",
  opacity: 1,
};

export default function LogoCollection() {
  return (
    <Box id="logoCollection" sx={{ py: 4 }}>
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        color="text.secondary"
      >
        Our partners
      </Typography>
      <Grid container justifyContent="center" sx={{ mt: 0.5, opacity: 0.6 }}>
        {darkLogos.map((logo, index) => (
          <Grid item key={index}>
            <img
              src={logo}
              alt={`Company logo number ${index + 1}`}
              style={logoStyle}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

import { createTheme } from "@mui/material/styles";
import { indigo, red, grey, green } from "@mui/material/colors";


// Define the primary and secondary colors using the indigo and grey palettes
const primaryColor = indigo;
const secondaryColor = grey;

// Simplified theme configuration function
export const getLPTheme = () =>
  createTheme({
    palette: {
      mode: "light",
      primary: {
        main: primaryColor[500],
        light: primaryColor[300],
        dark: primaryColor[700],
        contrastText: "#fff",
      },
      secondary: {
        main: secondaryColor[500],
        light: secondaryColor[300],
        dark: secondaryColor[700],
      },
      error: {
        main: red[500],
        light: red[300],
        dark: red[700],
      },
      warning: {
        main: green[500],
        light: green[300],
        dark: green[700],
      },
      success: {
        main: green[500],
        light: green[300],
        dark: green[700],
      },
      background: {
        default: "#fff",
        paper: grey[50],
      },
      text: {
        primary: grey[800],
        secondary: grey[600],
      },
    },
    typography: {
     fontFamily: '"Poppins", "sans-serif"',
      h1: {
        fontSize: "2.125rem",
        fontWeight: 600,
      },
      h2: {
        fontSize: "1.75rem",
        fontWeight: 600,
      },
      // Additional typography settings
      h3: { fontSize: "1.5rem", fontWeight: 500 },
      h4: { fontSize: "1.25rem", fontWeight: 500 },
      h5: { fontSize: "1rem", fontWeight: 400 },
      h6: { fontSize: "0.875rem", fontWeight: 400 },
      subtitle1: { fontSize: "1rem", fontWeight: 400 },
      subtitle2: { fontSize: "0.875rem", fontWeight: 400 },
      body1: { fontSize: "1rem", fontWeight: 400 },
      body2: { fontSize: "0.875rem", fontWeight: 400 },
      button: { textTransform: "none" },
      caption: { fontSize: "0.75rem" },
      overline: { fontSize: "0.625rem", textTransform: "uppercase" },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
          },
          containedPrimary: {
            backgroundColor: primaryColor[500],
            color: "#fff",
            "&:hover": {
              backgroundColor: primaryColor[700],
            },
          },
          outlinedPrimary: {
            color: primaryColor[500],
            borderColor: primaryColor[500],
            "&:hover": {
              backgroundColor: primaryColor[50],
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            backgroundColor: primaryColor[50],
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: grey[50],
            '&[elevation="0"]': {
              boxShadow: "none",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: `0px 5px 5px -3px ${grey[300]}`,
            "&:hover": {
              boxShadow: `0px 8px 10px -5px ${grey[300]}`,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: primaryColor[100],
            color: primaryColor[700],
            "&.MuiChip-clickable:hover": {
              backgroundColor: primaryColor[200],
            },
          },
        },
      },
      // Additional component overrides can be specified here
    },
  });

export default getLPTheme;

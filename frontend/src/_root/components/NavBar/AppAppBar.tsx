import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import { Link } from 'react-router-dom'
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import getLPTheme from "../../../styles/getLPTheme";
import UserOption from "./UserOption";

const logoStyle = {
  width: "auto",
  height: "32px",
  cursor: "pointer",
};

const LPtheme = createTheme(getLPTheme());



const AppAppBar = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const userId = localStorage.getItem('userId') || null;
  const username = localStorage.getItem('userName') || null;


  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleClickNav = (sectionName: string) => {
   if (sectionName === "home") {
      window.location.href = "/home";
    }
    if (sectionName === "features") {
      window.location.href = "/features";
    }
    if (sectionName === "jobs") {
      window.location.href = "/matching-jobs";
    }
  };

  return (
    <ThemeProvider theme={LPtheme}>
    <AppBar position="sticky" sx={{ bgcolor: theme.palette.background.paper }}>
      <Container maxWidth="lg" >
        <Toolbar variant="regular" sx={{ justifyContent: "space-between" }}>
            <Link to="/landing-page">
          <Box  sx={{ display: "flex", alignItems: "center" }} >
            <img
              src={"./static/aceresume_logo.svg"}
              style={logoStyle}
              alt="Logo"
            />

              <div className="text-2xl text-black tracking-wide ml-2 font-semibold">
            ace<span className="text-indigo-900">resume</span>
          </div>

          </Box>
          </Link>

          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", paddingRight:'7rem' }}>
          <MenuItem
              onClick={() => handleClickNav("home")}
              sx={{
                color: theme.palette.text.primary,
                "&:hover": { color: theme.palette.primary.main },
              }}
            >
              <Typography>Home</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => handleClickNav("features")}
              sx={{
                color: theme.palette.text.primary,
                "&:hover": { color: theme.palette.primary.main },
              }}
            >
              <Typography>Features</Typography>
            </MenuItem>



            <MenuItem
              onClick={() => handleClickNav("jobs")}
              sx={{
                color: theme.palette.text.primary,
                "&:hover": { color: theme.palette.primary.main },
              }}
            >
              <Typography>Jobs</Typography>
            </MenuItem>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            { !username && (
              <>
              <Button
                variant="outlined"
                color="primary"
                component="a"
                href="/sign-in"
                sx={{ width: 100 }}
              >
                Sign in
              </Button>

              <Button
                variant="contained"
                color="primary"
                component="a"
                href="/sign-up"
                sx={{ width: 100 }}
              >
                Sign up
              </Button>
              </>
              )}

              { username && (
                <Link to="/profile">
                <Box sx={{ width: 40, height: 40, flexShrink: 0, mr: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: "#6182FB", borderRadius: "50%" }}>
                  <Typography fontWeight="500" sx={{ color: 'white', fontSize: '18px' }}>{username.charAt(0)}</Typography>
                </Box>
              </Link>
              )}
          </Box>
          <Box
            sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
          >
            <Button
              variant="text"
              color="inherit"
              onClick={toggleDrawer(true)}
              sx={{ minWidth: "30px", p: "4px" }}
            >
              <MenuIcon />
            </Button>
          </Box>
        </Toolbar>
      </Container>

    </AppBar>
    </ThemeProvider>
  );
};

export default AppAppBar;

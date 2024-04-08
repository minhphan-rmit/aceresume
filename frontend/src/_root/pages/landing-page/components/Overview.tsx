import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Example icon
import AssignmentIcon from '@mui/icons-material/Assignment'; // Example icon
import SearchIcon from '@mui/icons-material/Search'; // Example icon

export default function Overview() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {/* Left-hand side with title, paragraph, and steps */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h2" gutterBottom>
            Quick Steps To Getting A Job
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Li Europan lingues es membres del sam familie. Lor separat existentie es un myth.
          </Typography>
          <Paper elevation={0}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Create Account" secondary="Li Europan lingues es membres del sam familie. Lor separat existentie." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Complete Your Profile" secondary="Li Europan lingues es membres del sam familie. Lor separat existentie." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="Hunting Jobs" secondary="Li Europan lingues es membres del sam familie. Lor separat existentie." />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Right-hand side with SVG image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="/path/to/your/image.svg" // Update the path to your SVG image
            alt="Job Hunting"
            sx={{
              width: '100%',
              maxWidth: '500px',
              height: 'auto',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

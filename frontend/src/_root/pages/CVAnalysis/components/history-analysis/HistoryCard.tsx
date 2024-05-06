import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function HistoryCard({ filename, resume_id, resume_url, created_at }) {
  const [expanded, setExpanded] = React.useState(false);
  const dateString = created_at;
  const formattedDate = dateString.split('T')[0];



  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className='shadow-sm' sx={{ maxWidth: 200, maxHeight:300 }}>
      <CardHeader
       className='hover:outline outline-indigo-500 cursor-pointer '
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={<Typography   className="text-wrap">{filename}</Typography>}
        subheader={formattedDate}

      />
      <CardMedia
        component="img"
        height="194"
        image={resume_url}
        alt={filename}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">

        </Typography>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>

      </Collapse>
    </Card>
  );
}

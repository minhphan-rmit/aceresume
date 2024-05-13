import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import MoreVertIcon from '@mui/icons-material/MoreVert';



export default function HistoryCard ({filename, resume_id, resume_url, created_at, onClick }) {
  const [expanded, setExpanded] = React.useState(false);
  const dateString = created_at;
  const formattedDate = dateString.split('T')[0];



  return (
    <Card className='shadow-sm' sx={{ width: 200, height:300, textWrap:'wrap' }} onClick={() => onClick(resume_id, resume_url)} >
      <div
       className='hover:outline outline-indigo-500 cursor-pointer flex flex-row p-3 w-full '
      >
        <div className='w-4/5 overflow-wrap '>
        <Typography className="break-words overflow-hidden" >{filename}</Typography>
        <Typography className="break-words overflow-hidden text-gray-500">{formattedDate}</Typography>
        </div>
        <CardActions disableSpacing>
        <IconButton aria-label="more" >
          <MoreVertIcon/>
        </IconButton>
      </CardActions>
      </div>
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


    </Card>
  );
}

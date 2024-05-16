import * as React from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}


const RoadmapCard = ({ roadmap, onClick }) => {
    const formattedDate = roadmap.created_at.split('T')[0];
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle the isOpen state
    const toggleDetails = () => {
        setIsOpen(!isOpen);
    };


    // Inline styles for expanding and collapsing
    const detailStyles = {
        maxHeight: isOpen ? '500px' : '0px', // Adjust max-height as needed
        overflow: 'hidden',
        transition: 'max-height 1s ease-in-out',
        padding: isOpen ? '20px' : '0 20px' // Padding for visual effect
    };




    return (
        <div className="relative mt-6 flex w-96 flex-col rounded-xl bg-gray-50 text-gray-700 shadow-md cursor-pointer" >

            <div className="p-6">
                <details className='open:row-span-2 ' > <summary  onClick={toggleDetails} style={{ cursor: 'pointer' }}>
                <h5 className="mb-2 text-xl font-semibold text-gray-700">{roadmap.roadmap_name}</h5>
                <p>Generated at: {formattedDate}</p>

                <div className="pt-4 flex items-center">
                    <p>Status:</p>
                <CircularProgressWithLabel value={roadmap.roadmap_details.progress} />
                </div></summary>
                <div style={detailStyles}>
                <p className="text-left text-gray-600 font-semibold">List of topics: </p>

               {
                     roadmap.roadmap_details.list_of_roadmap.map((task, index) => {
                          return (
                            <div key={index} className="p-4 border-b border-gray-200">
                                 <h5 className="text-sm  text-gray-500">{task.topic_name}</h5>

                            </div>
                          )
                     })
               }
            </div>
                </details>

                <Button variant="contained" color="primary" onClick={onClick} className="mt-4">
                    View Details
                </Button>
            </div>
        </div>
    );
}

export default RoadmapCard;

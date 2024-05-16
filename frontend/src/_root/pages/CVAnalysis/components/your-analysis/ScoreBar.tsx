import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';

// Adjust the component to accept a prop of type { score: number }
const ScoreBar = ({ score }: { score: number }) => {
    // Directly use score as a number
    const [progress, setProgress] = React.useState(score);
    const [buffer, setBuffer] = React.useState(5);

    const progressRef = React.useRef<() => void>(() => {});

    React.useEffect(() => {
        progressRef.current = () => {
            if (progress > score) {
                setProgress(0);
                setBuffer(10);
            } else {
                const diff = Math.random() * 10;
                const diff2 = Math.random() * 10;
                setProgress(progress + diff);
                setBuffer(progress + diff + diff2);
            }
        };
    }, [progress]);

    React.useEffect(() => {
        const timer = setInterval(() => {
            progressRef.current();
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <>
        <div className="flex flex-row items-center justify-between w-full">
            <div><h2 className="text-3xl font-bold text-gray-700">
                Score
            </h2>
            <h5 className="text-sm text-gray-700 mt-4 font-light italic">
                This score is based on the analysis of your resume
            </h5></div>
            <div className='text-5xl text-indigo-700 font-bold '>{score} <span className='text-gray-700 font-bold text-3xl'> / 100</span></div>

            </div>

            <div className="flex items-center mt-5 w-full">
                <Box sx={{ width: '100%' }}>
                    <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} color="primary" sx={{ height: '15px' }} />
                </Box>
            </div>
        </>
    );
}

export default ScoreBar;

import React, { useState, useEffect } from 'react';
import RoadmapCard from "./RoadmapCard";
import axios from 'axios';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import showNotification from '../../../../components/Notification/Notification';

interface GeneratedRoadmapProps {
    onChangeSuccess: (roadmapId: string) => void;


  }


const GeneratedRoadmap: React.FC<GeneratedRoadmapProps> = ({ onChangeSuccess})  => {
    const [roadmapList, setRoadmapList] = useState([]);
    const userId = localStorage.getItem('userId') || '663852ecd568222769540792'; // Default to a user ID if not found
    const navigate = useNavigate();

    useEffect(() => {
        getAllRoadmaps();
    }, []); // Fetch roadmaps on component mount

    const getAllRoadmaps = async () => {
        try {
            const response = await axios.get(` https://ace-resume-backend-7fotus647q-as.a.run.app/api/aceresume/resume/${userId}/get_all_roadmaps`,
            {
                params: {
                    resume_id: localStorage.getItem('resumeId')
                }
            }
            );
            console.log('Roadmaps:', response.data);
            setRoadmapList(response.data);
        } catch (error) {
            console.error('Error getting roadmaps:', error);
           showNotification({type: 'error', message: 'Error getting roadmaps'});
        }
    }

    const handleCardClick = (roadmapId: string) => {

        onChangeSuccess(roadmapId);
    }
    const addNewRoadmap = () => {
        navigate('?component=newRoadmap');
        window.location.reload();
    }

    return (
        <div className="w-full bg-white h-full rounded-lg flex flex-row  p-10 flex-wrap justify-between items-center overflow-y-scroll">
                  <h1 className="text-3xl font-bold text-gray-700 text-center w-1/3">Generated Roadmaps
                  {!roadmapList.length && <h1 className="text-sm font-light text-gray-500 italic">No roadmaps generated yet</h1>}
</h1>

                  <div className="w-2/3 text-right flex items-center gap-4 flex-wrap">

            {roadmapList.map((roadmap, index) => (
                <RoadmapCard key={index} roadmap={roadmap} onClick={() => handleCardClick(roadmap.roadmap_id)} />
            ))}

<Button onClick={addNewRoadmap} className="hover:bg-none w-min h-min" style={{ minWidth: 'auto' }}>
                        <svg width="80px" height="80px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#6366f1">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#4f46e5" strokeWidth="1.344" strokeLinecap="round" />
                                <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#4f46e5" strokeWidth="1.344" strokeLinecap="round" />
                            </g>
                        </svg>
                    </Button>
        </div>
        </div>
    );
}

export default GeneratedRoadmap;

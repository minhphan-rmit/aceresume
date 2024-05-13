import React, { useState, useEffect } from 'react';
import RoadmapCard from "./RoadmapCard";
import axios from 'axios';

interface GeneratedRoadmapProps {
    onChangeSuccess: (roadmapId: string) => void;


  }


const GeneratedRoadmap: React.FC<GeneratedRoadmapProps> = ({ onChangeSuccess})  => {
    const [roadmapList, setRoadmapList] = useState([]);
    const userId = localStorage.getItem('userId') || '663852ecd568222769540792'; // Default to a user ID if not found

    useEffect(() => {
        getAllRoadmaps();
    }, []); // Fetch roadmaps on component mount

    const getAllRoadmaps = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/aceresume/resume/${userId}/get_all_roadmaps`,
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
            alert('Error getting roadmaps');
        }
    }

    const handleCardClick = (roadmapId: string) => {

        onChangeSuccess(roadmapId);
    }

    return (
        <div className="w-full bg-white h-full rounded-lg flex flex-row  p-10 flex-wrap justify-between items-center overflow-y-scroll">
                  <h1 className="text-3xl font-bold text-gray-700 text-center w-1/3">Generated Roadmaps</h1>
                  <div className="w-2/3 text-right flex items-center gap-4 flex-wrap">

            {roadmapList.map((roadmap, index) => (
                <RoadmapCard key={index} roadmap={roadmap} onClick={() => handleCardClick(roadmap.roadmap_id)} />
            ))}
        </div>
        </div>
    );
}

export default GeneratedRoadmap;

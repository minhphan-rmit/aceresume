import RoadmapOverview from "./RoadmapOverview";
import TaskList from "./TaskList";
import Progress from "./Progress";
import axios from "axios";
import showNotification from '../../../../components/Notification/Notification';

import { useState, useEffect } from "react";
const CurrentRoadmap = (roadmapId) => {
    const userId = localStorage.getItem('userId') || '663852ecd568222769540792'; // Default to a user ID if not found
    const resumeId = localStorage.getItem('resumeId');
    const [roadmap, setRoadmap] = useState<any>(null);

    useEffect(() => {
        const roadmapIdFinal = localStorage.getItem('roadmapId')? localStorage.getItem('roadmapId'): roadmapId;

        if (roadmapIdFinal){
            getCurrentRoadmap(roadmapIdFinal);}
    }, []);


const getCurrentRoadmap = async (roadmapId: string) => {
    try {
        // Make sure to await the axios call
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/resume/${userId}/${resumeId}/get_roadmap`, {
            params: {
                roadmap_id: roadmapId
            }
        });

       console.log('Current Roadmap:', response.data);
        setRoadmap(response.data);
    }
    catch (error) {
        console.error('Error getting current roadmap:', error);
        showNotification({type: 'error', message: 'Error getting current roadmap'});
    }
}


    return (<>
    {roadmap &&
    <div>
         <div className="flex flex-col p-10 items-start  w-full text-gray-700 bg-white rounded-lg shadow-lg">
         {roadmap &&   <Progress score={roadmap.roadmap.progress}/>}
         </div>
         <div className="flex flex-col p-10 items-start  w-full text-gray-700 bg-white rounded-lg shadow-lg mt-4">

         {roadmap && <RoadmapOverview roadmap={roadmap} />}
         </div>
         <div className="flex flex-col p-10 items-start  w-full text-gray-700 bg-white rounded-lg shadow-lg mt-4">
           {roadmap && <TaskList roadmapDetails={roadmap.roadmap} roadmapId = {roadmap.roadmap_id}/>}
         </div>
         </div>
}
{!roadmap &&
    <div className="flex flex-col p-10 items-center justify-center  w-full text-gray-700 bg-white rounded-lg shadow-lg h-full "> <h1 className="text-3xl font-bold text-gray-700 text-center w-full ">No roadmap selected</h1></div>}
</>)
}
export default CurrentRoadmap;

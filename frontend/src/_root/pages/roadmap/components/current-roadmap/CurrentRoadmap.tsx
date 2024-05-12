import RoadmapOverview from "./RoadmapOverview";
import TaskList from "./TaskList";
import Progress from "./Progress";
import axios from "axios";
import { useState, useEffect } from "react";
const CurrentRoadmap = (roadmap) => {




    return (<>
         <div className="flex flex-col p-10 items-start  w-full text-gray-700 bg-white rounded-lg shadow-lg">
            <Progress score={80}/>
         </div>
         <div className="flex flex-col p-10 items-start  w-full text-gray-700 bg-white rounded-lg shadow-lg">
            <RoadmapOverview/>
         </div>
         <div className="flex flex-col p-10 items-start  w-full text-gray-700 bg-white rounded-lg shadow-lg">
            <TaskList/>
         </div>

</>)
}
export default CurrentRoadmap;

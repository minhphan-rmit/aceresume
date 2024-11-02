import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import axios from "axios";
import showNotification from '../../../../components/Notification/Notification';


interface Task {
  topic_name: string;
  topic_description: string;
  resources: string[];
  knowledge_list: string[];
  is_done: boolean;
}

interface Roadmap {
  level?: string;
  list_of_roadmap?: Task[];
  summary?: string;
  progress?: number;
}

interface ListOfRoadmapProps {

  roadmapDetails?: Roadmap; // Make optional to handle cases where it might be undefined
  roadmapId: string;
}

const ListOfRoadmap: React.FC<ListOfRoadmapProps> = ({ roadmapDetails, roadmapId }) => {
  if (!roadmapDetails || !roadmapDetails.list_of_roadmap) {
    return <div>Loading roadmap details...</div>; // Display loading or any placeholder
  }

  // Initialize the checked state based on each task's is_done property
  const [checkedStates, setCheckedStates] = useState<boolean[]>(roadmapDetails.list_of_roadmap.map(task => task.is_done));
  const [editMode, setEditMode] = useState<boolean>(false);


  // Handle change for each checkbox
  const handleCheckboxChange = async (index: number, isChecked: boolean) => {
    const newCheckedStates = [...checkedStates];
    newCheckedStates[index] = isChecked;
    setCheckedStates(newCheckedStates);

    // Update the target status in the backend
    console.log('Updating target status:', roadmapId, index, isChecked);
    await updateTargetStatus(roadmapId, index, isChecked);


};
const updateTargetStatus = async (roadmapId: string, targetIndex: number, isDone: boolean) => {
  try {
      const response = await axios.put(` ${process.env.REACT_APP_API_BASE_URL}/resume/${roadmapId}/update_target`, {
          target_index: targetIndex,
          is_done: isDone
      });

      console.log('Update response:', response.data);
      showNotification({type: 'success', message: 'Status updated successfully'});
      return response.data;
  } catch (error) {
      console.error('Error updating target status:', error);
      showNotification({type: 'error', message: 'Error updating status'});
  }
};



  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const saveChanges = () => {
    // Perform save to backend or local storage
    toggleEditMode(); // Disable edit mode after saving
    window.location.reload();
  };

  return (
    <div className="p-4 w-full">
        <div className="flex flex-row justify-between">
      <h1 className="text-3xl font-bold text-gray-700">Checklists</h1>

                <div className="inline-flex space-x-2 items-center">
                    <button onClick={saveChanges} disabled={!editMode} className="p-2 border border-slate-200 rounded-md inline-flex space-x-1 items-center text-white hover:text-white bg-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium hidden md:block">Save</span>
                    </button>
                    <button onClick={toggleEditMode} disabled={editMode} className="p-2 border border-slate-200 rounded-md inline-flex space-x-1 items-center ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                          <span className="text-sm hidden md:block">Edit</span>
                    </button>
                </div>
     </div>
      <p className="mt-1 text-gray-500">Level: {roadmapDetails.level}</p>
      {roadmapDetails.list_of_roadmap.map((task, index) => (
        <details key={index} className="open:row-span-2 w-full mt-4 p-3 bg-gray-50 rounded-lg shadow-sm cursor-pointer">
          <summary className="text-lg font-semibold flex justify-between items-center">
            <div className="w-1/2">{task.topic_name}</div>
            <Checkbox
              checked={checkedStates[index]}
              onChange={(e) => handleCheckboxChange(index, e.target.checked)}
              disabled={!editMode}
              inputProps={{ 'aria-label': `controlled-${index}` }}
              name={roadmapDetails.roadmap_id}
            />
          </summary>
          <div className="mt-2 space-y-3">
            <p>{task.topic_description}</p>
            <div>
              <h4 className="font-semibold">Knowledge List:</h4>
              <ul className="list-disc pl-5">
                {task.knowledge_list.map((knowledge, key) => (
                  <li key={key}>{knowledge}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Resources:</h4>
              <ul className="list-disc pl-5">
                {task.resources.map((resource, key) => (
                  <li key={key}>
                    <a href={resource} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {resource}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-sm font-medium">
              Status: {checkedStates[index] ? 'Completed' : 'Pending'}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
};

export default ListOfRoadmap;

import { useState,FormEvent, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import axios from 'axios';
import showNotification from '../../../../components/Notification/Notification';

interface NewRoadmapProps {
    onGeneratedSuccess: (roadmapId: string) => void;

}
const NewRoadmap: React.FC<NewRoadmapProps> = ({ onGeneratedSuccess })  => {

     // State to manage dropdown visibility
     const userId = localStorage.getItem('userId'); // Assume this is the user ID


     const resumeId = localStorage.getItem('resumeId');
     useEffect(() => {
        if (!resumeId) {
          showNotification({ type: 'info', message: 'No resume selected. Please select a resume to proceed' });
        }
      }, [resumeId]);
     const [isGenerating, setIsGenerating] = useState(false);

     const [roadmapName, setRoadmapName] = useState('');
        const [jobDescription, setJobDescription] = useState('');

        const handleRoadmapNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setRoadmapName(e.target.value);
        }

        // Event handler for updating the job description
        const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setJobDescription(e.target.value);
        }



        const  handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!roadmapName || !jobDescription) {
                alert('Please fill in all fields');
                return;
            }
            console.log('Roadmap Name:',roadmapName, 'Job Description:',jobDescription)


            try {
                setIsGenerating(true);
                const response = await axios.post(`http://localhost:8000/api/aceresume/resume/${userId}/roadmap-generate`, null,
                {
                    params:{
                    resume_id: resumeId,
                    job_description: jobDescription,
                    roadmap_name: roadmapName
                    }
                });
                console.log('Generated roadmap:', response.data);

                onGeneratedSuccess(response.data);
                setIsGenerating(false);


            } catch (error) {
                setIsGenerating(false);
                console.error('Error generating roadmap:', error);
                alert('Error generating roadmap');
            }
        }
     // Toggle dropdown visibility

    return (
        <div className="w-full bg-white h-full rounded-lg  flex flex-col items-center p-10">
            {isGenerating && (<Box sx={{
        height: '90vh',
        borderRadius: '10px',
        position: 'absolute',
        top: 186,
        left: 40,
        right: 40,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 4
    }}>
        <Typography variant="h5" color="common.white">Generating Roadmap...</Typography>
    </Box>
)}
            <div className=" w-full  bg-white rounded-xl z-10 flex flex-row items-center justify-between gap-10">
		<div className=" ">
			<h2 className="mt-5 text-3xl font-bold text-gray-900">
				 Create your personalized roadmap!
			</h2>
			<p className="mt-2 text-sm text-gray-400 text-left">Don't know what separates you from your dream career? Our AI Roadmap Generator will help you identify gaps in your skillset based on your resume and tell you how to become the ideal candidate for the job you want.</p>

<p className="mt-2 text-sm text-gray-400 text-left">Enter the name of your desired job description and the AI will recommend books and resources that will help you grow into the professional you dream to be. <span className="italic">(Only works in English.)</span></p>
		</div>
        <form className="mt-8 space-y-3 w-full" onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-1 space-y-2 ">
                        <label className="text-sm font-bold text-gray-500 tracking-wide">Title</label>


        <input required   name="roadmapName" className=" w-full text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" type="text" placeholder="Name your Roadmap" value={roadmapName}
                            onChange={handleRoadmapNameChange} />


           </div>
                    <div className="grid grid-cols-1 space-y-2">
                                    <label className="text-sm font-bold text-gray-500 tracking-wide">Job Description</label>
                        <div className="flex items-center justify-center w-full">

                            <textarea required name="jobDescription" className="resize-y rounded-md flex flex-col  border-4 border-dashed w-full h-60 p-10 group text-left" value={jobDescription}
                                onChange={handleJobDescriptionChange}></textarea>


                        </div>
                    </div>

                    <div>
                    <button
        disabled={!resumeId}
        className={`my-5 w-full flex justify-center p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline shadow-lg transition ease-in duration-300 ${
          resumeId ? 'bg-indigo-500 hover:bg-indigo-600 cursor-pointer text-gray-100' : 'bg-gray-400 cursor-not-allowed text-gray-200'
        }`}
      >
        Generate
      </button>
                    </div>
        </form>
	</div>
</div>
    );
}
export default NewRoadmap;

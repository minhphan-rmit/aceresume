import {useState, useEffect} from 'react';
import {ChangeEvent, FormEvent} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import FileUploadUtils from '../../../../../config/FileUploadUtils'
import { set } from 'firebase/database';
import { StringFormat } from 'firebase/storage';
import { ContactlessOutlined } from '@mui/icons-material';


interface NewAnalysisProps {
    onUploadSuccess: (url: string) => void;
    onAnalysisSuccess: (resumeAnalysis: JSON) => void;
}

const NewAnalysis: React.FC<NewAnalysisProps> = ({ onUploadSuccess, onAnalysisSuccess }) =>{
    const {
        uploadFile,
        handleDelete,
        downloadURL,
        progress,
        selectedFile,
        setSelectedFile
      } = FileUploadUtils();

    const navigate = useNavigate();
      const [isExtractingData, setIsExtractingData] = useState(false);
      const [isAnalyzingData, setIsAnalyzingData] = useState(false);
    const userId = '1234'; // Assume this is the user ID



    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setSelectedFile(file);


        }
    };


    const handleUpload = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        uploadFile(
            (url: string) => {
                handleSubmit(url);  // This will now correctly handle the URL after it's available
                onUploadSuccess(url);

            },
            (error: any) => {
                alert('Error uploading file: ' + error.message);
            }
        );
    };

      const extractData = async (resumeId: string) => {
        setIsExtractingData(true);
        try {
            const response = await axios.post(`http://localhost:8000/api/aceresume/resume/${userId}/${resumeId}/summarize`, {
            });
            setIsExtractingData(false);

            console.log("Resume Info:", response.data);

            analyzingData(resumeId, response.data);

        }catch (error) {
            console.error('Error extracting data from file:', error);
           alert('Error extracting data from file');
        }
      }

      const analyzingData = async (resumeId: string, resumeInfo: any) => {
        console.log('File:', selectedFile.name);
        console.log('Analyzing data:', resumeInfo);
        setIsAnalyzingData(true);


        try {
            const response = await axios.post(
                `http://localhost:8000/api/aceresume/resume/${userId}/${resumeId}/analyse`,
                {
                    filename: selectedFile.name,
                    resume_info: resumeInfo,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                }}

            );
            onAnalysisSuccess(response.data);
        }catch (error) {
            console.error('Error analyzing data from file:', error);
           alert('Error analyzing data from file');
        }
      }


    const handleSubmit = async (url: string) => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', selectedFile);
        formData.append('resume_url', url);

        try {
            const response = await axios.post(`http://localhost:8000/api/aceresume/resume/${userId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Upload successful');
            console.log(response.data);
            localStorage.setItem('resumeId', response.data.object_id);
            console.log('Resume ID:', response.data.object_id);

            // Extract data from resume

const resumeId = localStorage.getItem('resumeId');
           extractData(resumeId);

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        }
    };



    return (
    <>

<div className="w-full bg-white h-full rounded-lg  flex flex-col items-center p-10">
{isExtractingData && (<Box sx={{
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
        <Typography variant="h5" color="common.white">Extracting Data...</Typography>
    </Box>
)}
{isAnalyzingData && (<Box sx={{
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
        <Typography variant="h5" color="common.white">Analying Data...</Typography>
    </Box>
)}
       <div className="sm:max-w-lg w-full  bg-white rounded-xl z-10">
		<div className="text-center">
			<h2 className="mt-5 text-3xl font-bold text-gray-900">
				 Upload Your Resume Here!
			</h2>
			<p className="mt-2 text-sm text-gray-400">Upload your resume here!</p>
		</div>
        <form className="mt-8 space-y-3" onSubmit={handleUpload}>

                    <div className="grid grid-cols-1 space-y-2">
                                    <label className="text-sm font-bold text-gray-500 tracking-wide">Attach Document</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-70 p-10 group text-center">
                                <div className="h-full w-full text-center flex flex-col items-center justify-center  ">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                                    <img className="has-mask h-36 object-center" src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg" alt="freepik image"/>
                                    </div>
                                    <p className="pointer-none text-gray-500 "><span className="text-sm">Drag and drop</span> files here <br /> or <a href="" id="" className="text-blue-600 hover:underline">select a file</a> from your computer</p>
                                </div>
                                <input type="file" className="hidden" name='file' onChange={handleFileChange}/>
                                {selectedFile && <p className='p-2 rounded-lg bg-indigo-500 text-white mt-4'>Selected file: {selectedFile.name}</p>}

                            </label>
                        </div>
                    </div>
                            <p className="text-sm text-gray-300">
                                <span>File type: doc,pdf</span>
                            </p>
                    <div>
                        <button type="submit" className="my-5 w-full flex justify-center bg-indigo-500 text-gray-100 p-4  rounded-full tracking-wide
                                    font-semibold  focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300">
                        Upload
                    </button>
                    </div>
        </form>
	</div></div>
    </>)
 }

export default NewAnalysis;

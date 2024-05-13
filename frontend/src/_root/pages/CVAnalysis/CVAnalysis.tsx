import React,{useEffect, useState} from 'react';
import AppNavBar from '../../components/NavBar/AppAppBar';
import FeatureBar from '../../components/FeatureBar/FeatureBar';
import CVAnalysisSideBar from './components/CVAnalysisSideBar';
import NewAnalysis from './components/new-analysis/NewAnalysis';
import CVPreview from './components/cv-preview/CVPreview';
import Examples from './components/examples/Examples';
import Guide from './components/guide/Guide';
import HistoryAnalysis from './components/history-analysis/HistoryAnalysis';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import getLPTheme from "../../../styles/getLPTheme";
import YourAnalysis from './components/your-analysis/YourAnalysis';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from "@mui/material/styles";




const CVAnalysis = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const LPtheme = createTheme(getLPTheme());
  const [selectedComponent, setSelectedComponent] = React.useState(query.get('component') || 'newAnalysis');
  const [selectedAlignment, setSelectedAlignment] = React.useState(query.get('toggle') || 'preview');

  const handleUploadSuccess = (url:string) => {
    setFileUrl(url);
    localStorage.setItem('uploadedFileUrl', url);

  };

  const handleChangeSuccess = (resumeId: string, resumeUrl: string) => {
    setFileUrl(resumeUrl);
    setResumeId(resumeId);
    localStorage.setItem('resumeId', resumeId);
    localStorage.setItem('uploadedFileUrl', resumeUrl);
    console.log('Resume ID:', resumeId);
    setSelectedComponent('yourAnalysis');
  };



  // Update URL whenever the selected component or toggle changes
  useEffect(() => {
    navigate(`?component=${selectedComponent}&toggle=${selectedAlignment}`, { replace: true });
  }, [selectedComponent, selectedAlignment, navigate]);

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  const handleToggleChange = (event, newSelectedAlignment) => {
    if (newSelectedAlignment !== null) { // Ensuring we don't set undefined or null
      setSelectedAlignment(newSelectedAlignment);
    }
  };

  // render component based on selected component
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'newAnalysis':
       return <NewAnalysis onUploadSuccess={handleUploadSuccess}/>;
      case 'yourAnalysis':
        return <YourAnalysis resumeID={resumeId}/>;
      case 'historyAnalysis':
        return <HistoryAnalysis onChangeSuccess={handleChangeSuccess} />;
      default:
       return  <NewAnalysis onUploadSuccess={handleUploadSuccess}/>;
    }
  };

  // render toggle button based on selected component
  const renderToggleButton = () => {
    switch(selectedAlignment){
      case 'preview':
        return <CVPreview fileUrl={fileUrl} />;

      case 'guides':
        return <Guide/>

      default:
        return <Guide/>
    }
  }


  return (

    <>
        <ThemeProvider theme={LPtheme}>
           {/* NavBar Component */}
      <AppNavBar/>
       {/* End NavBar Component */}
         {/* FeatureBar Component */}
      <div><FeatureBar/></div>
        {/* End FeatureBar Component */}
      <div className="flex items-start justify-center w-screen h-screen p-10 space-x-6 bg-gray-100">
        {/* Sidebar Component */}
        <CVAnalysisSideBar onChange={handleComponentChange} />
        {/* Main Content Area */}
        <div className="flex flex-row w-full gap-4 h-full">

        <div className="flex flex-col gap-4 items-center w-3/5 h-full text-gray-700 bg-none rounded-lg overflow-y-auto  ">
        {renderComponent()}
</div>




          <div className="flex flex-col items-center w-2/5 h-full overflow-y-auto text-gray-700 bg-white rounded-lg shadow-lg p-5">
          <ToggleButtonGroup
      color="primary"
      value={selectedAlignment}
      exclusive
      onChange={handleToggleChange}
      aria-label="Platform"
      className="mt-5 rounded-lg"
    >
      <ToggleButton value="preview" className="flex items-center gap-2">
        <span><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></span>
        Preview</ToggleButton>
      <ToggleButton value="guides" className="flex items-center gap-2">
      <span>
      <svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" fill-rule="evenodd" d="M1.25 2C.56 2 0 2.56 0 3.25v8.5C0 12.44.56 13 1.25 13H5c.896 0 1.475.205 1.809.448.317.23.441.51.441.802a.75.75 0 001.5 0c0-.292.124-.572.441-.802.334-.243.913-.448 1.809-.448h3.75c.69 0 1.25-.56 1.25-1.25v-8.5C16 2.56 15.44 2 14.75 2H11c-1.154 0-2.106.354-2.772 1-.081.08-.157.161-.228.246A3.131 3.131 0 007.772 3C7.106 2.354 6.154 2 5 2H1.25zm7.5 9.967c.61-.309 1.372-.467 2.25-.467h3.5v-8H11c-.846 0-1.394.253-1.728.577-.335.325-.522.787-.522 1.34v6.55zm-1.5 0v-6.55c0-.553-.187-1.015-.522-1.34C6.394 3.753 5.846 3.5 5 3.5H1.5v8H5c.878 0 1.64.158 2.25.467z" clip-rule="evenodd"></path></g></svg>
        </span>
        Guides</ToggleButton>

    </ToggleButtonGroup>
    {renderToggleButton()}
          </div>
        </div>
      </div>
      </ThemeProvider>
    </>
  );
};

export default CVAnalysis;

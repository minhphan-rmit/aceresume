import React,{ useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import getLPTheme from "../../../styles/getLPTheme";
import AppNavBar from '../../components/NavBar/AppAppBar';
import RoadmapSideBar from './components/RoadmapSideBar';
import NewRoadmap from './components/new-roadmap/NewRoadmap';
import GeneratedRoadmap from './components/generated-roadmap/GeneratedRoadmap';
import CurrentRoadmap from './components/current-roadmap/CurrentRoadmap';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import FeatureBar from '../../components/FeatureBar/FeatureBar';

const Roadmap = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const LPtheme = createTheme(getLPTheme());
    const [selectedComponent, setSelectedComponent] = React.useState(query.get('component') || 'newRoadmap');

 // Update URL whenever the selected component or toggle changes
 useEffect(() => {
    navigate(`?component=${selectedComponent}`, { replace: true });
  }, [selectedComponent, navigate]);

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };


  // render component based on selected component
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'newRoadmap':
        return <NewRoadmap />;
      case 'currentRoadmap':
        return <CurrentRoadmap />;
      case 'historyRoadmap':
        return <GeneratedRoadmap />;
      default:
        return <NewRoadmap />;
    }
  };
    return (
        <ThemeProvider theme={LPtheme}>
    <AppNavBar />

    <div><FeatureBar/></div>
      <div className="flex items-start justify-center w-screen h-screen p-10 space-x-6 bg-gray-100">

      <RoadmapSideBar onChange={handleComponentChange}/>


        <div className="flex flex-col gap-4 items-center w-full h-full text-gray-700 bg-none rounded-lg overflow-y-auto  ">
        {renderComponent()}</div>
</div>


    </ThemeProvider>
    )
}
export default Roadmap;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the type for the navigation item
type NavItemProps = {
    label: string;
    index: number;
    isActive: boolean;
    onClick: (index: number) => void;
};

// A functional component for each navigation item
const NavItem: React.FC<NavItemProps> = ({ label, index, isActive, onClick }) => (
    <div className="nav-item relative w-full cursor-pointer " onClick={() => onClick(index)}>
        <div className={`nav-line absolute inset-x-0 top-[-3px]  h-0.5 hover:bg-indigo-300 transition-colors duration-300 ${isActive ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
        <div className="flex flex-col items-center pt-2">
            <div className={`nav-circle w-4 h-4 rounded-full hover:bg-indigo-300  -top-2.5 left-1/2 transform -translate-x-1/2 transition-colors duration-300 ${isActive ? 'bg-indigo-500' : 'bg-gray-300'} absolute -top-2.5 left-1/2 transform -translate-x-1/2 transition-colors duration-300`}></div>
            <button className="text-gray-700 mt-2">{label}</button>
        </div>
    </div>
);


// Main navigation bar component
const FeatureBar: React.FC = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const navItems = [
        { name: 'CV Analysis', path: '/cv-analysis' },
        { name: 'Roadmap Generator', path: '/roadmap' },
        { name: 'Mock Interview', path: '/mock-interview' }
    ];
    const handleItemClick = (index: number) => {
        setActiveIndex(index);
        navigate(navItems[index].path);
    };

    return (
        <div className="flex justify-between items-center px-10  bg-gray-100 pt-10">
            {navItems.map((item, index) => (
                <NavItem
                    key={index}
                    label={item.name}
                    index={index}
                    isActive={index <= (activeIndex ?? -1)}
                    onClick={handleItemClick}
                />
            ))}
        </div>
    );
};

export default FeatureBar;

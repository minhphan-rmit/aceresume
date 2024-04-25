import React from 'react';
import HistoryCard from "./HistoryCard";
import { Button } from "@mui/material";

const HistoryAnalysis = () => {
    return (
        <>
        <div className="w-full bg-white h-full rounded-lg  flex flex-col items-center p-10 overflow-y-auto">
            <div className="container w-full h-full px-5 rounded-xl z-10">
                <div className="flex items-center justify-between">
                <div className="text-left">
                    <h2 className="mt-5 text-3xl font-bold text-gray-900">
                        Previous Uploads
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Review your previous analysis here
                    </p>
                </div>
                <Button  className="hover:bg-none w-min h-min" style={{ minWidth: 'auto' }}>
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

                <div className="mt-10 flex gap-3 flex-wrap items-center justify-between">
                    <HistoryCard />
                    <HistoryCard />
                    <HistoryCard />
                    <HistoryCard />

                </div>
            </div></div>
        </>
    );
};

export default HistoryAnalysis;

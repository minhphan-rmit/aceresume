import React from 'react';

// Assuming the roadmap data is structured as you described
const RoadmapCard = ({ roadmap }) => {
    const {
        roadmap_name, // Using roadmap_name from the details
        roadmap: [
            [_, level], // Extracting level information
            [__, list_of_roadmap], // Extracting list of topics
            [___, summary], // Extracting summary
            [____, progress] // Extracting progress
        ]
    } = roadmap;

    // You might need additional checks if data might be inconsistent

    return (
        <div className="relative mt-6 flex w-full max-w-4xl flex-col rounded-xl bg-white shadow-md">
            <div className="p-6">
                <h4 className="text-lg font-semibold">{roadmap_name}</h4>
                <p className="text-sm text-gray-500">Level: {level}</p>
                <p className="mt-2 text-gray-700">{summary}</p>
            </div>
            <div className="px-6 py-4">
                {list_of_roadmap.map((topic, index) => (
                    <div key={index} className="mb-4">
                        <h5 className="font-bold">{topic[0][1]}</h5>
                        <p>{topic[1][1]}</p>
                        <div className="text-sm text-gray-600">Resources:</div>
                        <ul className="list-disc list-inside">
                            {topic[2][1].map((resource, index) => (
                                <li key={index} className="text-blue-600 hover:underline">
                                    <a href={resource} target="_blank" rel="noopener noreferrer">{resource}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="px-6 pt-4 pb-2">
                <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-right text-sm text-gray-600">{progress}% Completed</p>
            </div>
        </div>
    );
};

export default RoadmapCard;

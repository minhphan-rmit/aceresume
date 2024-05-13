import React, { useState } from 'react';

const roadmapSideBar = ({onChange}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);

  // Styles for collapsed and expanded sidebar
  const sidebarCollapsed = {
    width: '4rem',  // width for collapsed state
    transition: 'width 0.3s ease-in-out',
  };

  const sidebarExpanded = {
    width: '16rem',  // width for expanded state
    transition: 'width 0.3s ease-in-out',
  };

  return (
    <div
    style={isExpanded ? sidebarExpanded : sidebarCollapsed}
    onMouseEnter={() => {
      setIsExpanded(true);
      setIsSubMenuVisible(true);
    }}
    onMouseLeave={() => {
      setIsExpanded(false);
      setIsSubMenuVisible(false);
    }}
    className="flex flex-col items-center w-1/5 h-full overflow-hidden text-gray-700 bg-white rounded-lg shadow-lg shadow-indigo-500/40"
>

      <div className="flex items-center w-full mt-3">
        <div className="overflow-y-auto overflow-x-hidden flex-grow h-full">
          <ul className="flex flex-col py-4 space-y-1">
            <li className="px-5">
              <div className="flex flex-row items-center h-8">
                <div className="text-sm font-light tracking-wide text-gray-500">Roadmap Generator</div>
              </div>
            </li>
            <li onClick={() => onChange('newRoadmap')}>
              <a
                href="#"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">New Roadmap</span>
              </a>
            </li>
            <li onClick={() => onChange('currentRoadmap')}>
              <a
                href="#"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                onMouseEnter={() => setIsSubMenuVisible(true)}
                onMouseLeave={() => setIsSubMenuVisible(true)}
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">Your Roadmap</span>
              </a>
              <ul className={`flex flex-col space-y-1 ms-7 border-l-2 border-indigo-500 ${isSubMenuVisible ? 'block' : 'hidden'}`} id="submenu">
                <li>
                  <a
                    href="#"
                    className="relative flex flex-row items-center h-11 focus:outline-none text-gray-600 hover:text-indigo-800 hover:font-semibold border-l-4 border-transparent pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                          <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>
                        </g>
                      </svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">Progress</span>
                  </a>
                </li>

                {/* Add other submenu items here */}
                <li>
          <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none  text-gray-600 hover:text-indigo-800 border-l-4 border-transparent hover:font-semibold pr-6">
            <span className="inline-flex justify-center items-center ml-4">
            <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' viewBox="0 0 92 92" enable-background="new 0 0 92 92" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_1517_" d="M78.5,13.5c-17.9-17.9-47.1-17.9-65.1,0c-17.9,17.9-17.9,47.1,0,65.1c9,9,20.8,13.5,32.5,13.5 c11.8,0,23.6-4.5,32.5-13.5C96.5,60.6,96.5,31.4,78.5,13.5z M19.1,72.9C5.3,59,4.4,37,16.4,22.1l53.5,53.5 C55,87.6,33,86.8,19.1,72.9z M75.6,69.9L22.1,16.4C29,10.8,37.5,8,46,8c9.7,0,19.5,3.7,26.9,11.1C86.7,33,87.6,55,75.6,69.9z"></path> </g></svg>    </span>
            <span className="ml-2 text-sm tracking-wide truncate">Overview</span></a>
        </li>
        <li>
          <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none  text-gray-600 hover:text-indigo-800 border-l-4 border-transparent hover:font-semibold pr-6">
            <span className="inline-flex justify-center items-center ml-4">
            <svg className='h-5 w-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z" fill="#0F0F0F"></path> </g></svg>
            </span>            <span className="ml-2 text-sm tracking-wide truncate">Checklists</span>
          </a>
        </li>


              </ul>
            </li>
            {/* Add other sidebar items here */}

        <li onClick={() => onChange('historyRoadmap')}>
          <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
            <span className="inline-flex justify-center items-center ml-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </span>
            <span className="ml-2 text-sm tracking-wide truncate">Generated Roadmap</span>
          </a>
        </li>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default roadmapSideBar;

import React, { useState } from 'react';

const Guide = () => {

    const [isTOCOpen, setIsTOCOpen] = useState(false);

  const toggleTOC = () => {
    setIsTOCOpen(!isTOCOpen);
  };

  return (
    <div className="flex flex-col p-8 max-w-4xl mx-auto my-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">How to Write a Good Resume</h1>

      <div className="w-full">
        <button onClick={toggleTOC} className="bg-gray-200 text-gray-800 italic font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full">
          {isTOCOpen ? 'Hide Table of Contents' : 'Show Table of Contents'}
        </button>
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isTOCOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="w-full bg-gray-100 px-4 py-3 text-left text-gray-800 break-words max-w-md rounded-lg">
            <div className="mx-auto text-xl "><strong>Table of content</strong></div>
            <ul className="mt-2 list-disc px-2 pl-6">
              {/* Example list items with anchor links */}
              <li><a className="block hover:bg-gray-200 px-2 py-1 rounded" href="#introduction">Introduction</a></li>
              <li><a className="block hover:bg-gray-200 px-2 py-1 rounded" href="#keep-it-concise">Keep It Concise</a></li>
              <li><a className="block hover:bg-gray-200 px-2 py-1 rounded" href="#tailor-your-resume">Tailor Your Resume</a></li>
              <li><a className="block hover:bg-gray-200 px-2 py-1 rounded" href="#use-action-words">Use Action Words</a></li>
              <li><a className="block hover:bg-gray-200 px-2 py-1 rounded" href="#quantifiable-achievements">Include Quantifiable Achievements</a></li>
                <li><a className="block hover:bg-gray-200 px-2 py-1 rounded" href="#layout">Keep the Layout Clean</a></li>
                <li><a className="block hover:bg-gray-200 px-2 py-1 rounded" href="#proofread">Proofread</a></li>
                <li><a className="block hover:bg-gray-200 px-2 py-1 rounded" href="#use-keywords">Use Keywords</a></li>
              {/* Continue adding other sections */}
            </ul>
          </div>
        </div>
      </div>

      <div id="keep-it-concise">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">1. Keep It Concise</h2>
        <p className="text-md text-gray-600 mb-3">
          Your resume should be short and to the point. Aim for one page if possible, especially if you have less than 10 years of experience.
        </p>
      </div>

      <div id="tailor-your-resume">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">2. Tailor Your Resume</h2>
        <p className="text-md text-gray-600 mb-3">
          Customize your resume for each job application. Highlight skills and experiences that are relevant to the job you're applying for.
        </p>
      </div>

      <div id="use-action-words">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">3. Use Action Words</h2>
        <ul className="list-disc pl-5 text-gray-600 mb-3">
          <li>Achieved</li>
          <li>Managed</li>
          <li>Developed</li>
          <li>Designed</li>
        </ul>
      </div>

      <div id="quantifiable-achievements">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">4. Include Quantifiable Achievements</h2>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Type</th>
              <th className="px-4 py-2 text-left text-gray-600">Example</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr className="border-b">
              <td className="px-4 py-2">Sales Increase</td>
              <td className="px-4 py-2">Increased sales by 20% within six months.</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Cost Reduction</td>
              <td className="px-4 py-2">Reduced operating costs by 15% over one year.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="layout">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">5. Keep the Layout Clean</h2>
        <p className="text-md text-gray-600 mb-3">
          Use clear headings, bullet points and a professional font. This ensures that your resume is easy to read and looks neat.
        </p>
        <img src="https://via.placeholder.com/600x400" alt="Clean Layout Example" className="my-3 rounded-lg shadow-lg"/>
      </div>

      <div id="proofread">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">6. Proofread</h2>
        <p className="text-md text-gray-600 mb-3">
          Always proofread your resume. Spelling mistakes and grammatical errors can make you appear unprofessional.
        </p>
      </div>

      <div id="use-keywords">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">7. Use Keywords</h2>
        <p className="text-md text-gray-600 mb-3">
          Many companies use automated systems to screen resumes, so it's important to include keywords from the job description.
        </p>
      </div>

      <div className="mt-6">
        <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          Download Sample Resume
        </button>
      </div>
    </div>
  );
};

export default Guide;

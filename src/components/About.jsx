import React, { useState } from 'react';
import Navbar from './Navbar';
import Layout from '../Layout';

const About = () => {
  const [displayText, setDisplayText] = useState('');

  const handleAnalysisToolClick = () => {
    const analysisText = "Analysis Tool helps you analyze data and make informed decisions. It provides various tools and features to explore and visualize data.";
    setDisplayText(analysisText);
  };

  const handleStep1Click = () => {
    const step1Text = "Step 1 - IFE Matric: This step involves analyzing internal factors of an organization, such as strengths and weaknesses, to create an Internal Factor Evaluation (IFE) matrix.";
    setDisplayText(step1Text);
  };

  // Add other click handlers and text variables as needed for other steps

  return (
    <div className="flex h-screen pt-[8vh]">
      <div className="bg-gray-300 w-[20%] h-screen fixed left-0 z-10 overflow-hidden">
        <div className="flex flex-col items-start justify-start h-full p-4">
          <span className="text-xl font-bold mb-4">About</span>
          <div className="box-container">
            <a
              href="#"
              className="text-gray-600 hover:underline hover:bg-gray-200 p-2 rounded-md transition duration-100 ease-in-out"
              onClick={handleAnalysisToolClick}
            >
              What is Analysis Tool
            </a>
          </div>
          <div className="mt-6">
            <span className="text-xl font-bold mb-2">Quick start</span>
            <ul className="list-disc pl-4 py-4">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:underline hover:bg-gray-200 p-2 rounded-md transition duration-100 ease-in-out"
                  onClick={handleStep1Click}
                >
                  Step 1 - IFE Matric
                </a>
              </li>
              {/* Add other steps as needed */}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-[80%] h-screen bg-gray-200 ml-[20%] z-0">
        <div className="p-4">{displayText}</div>
      </div>
    </div>
  );
};

export default About;

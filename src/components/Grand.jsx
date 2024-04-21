import React, { useState } from 'react';


const Grand = () => {
  const [firmName, setFirmName] = useState('');
  const [divisionNames, setDivisionNames] = useState(['', '', '', '', '']);
  const [xAxisScores, setXAxisScores] = useState(['', '', '', '', '']);
  const [yAxisScores, setYAxisScores] = useState(['', '', '', '', '']);


  const handleSubmit = (event) => {
    event.preventDefault();
    // Your submission logic here
  };


  return (
    <div className="bg-slate-700 min-h-screen">
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold text-white mb-8">Grand Strategy Matrix</h1>
        <div className="max-w-[80vw] w-full bg-white p-8 border border-gray-300 rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="firmName" className="block mb-2">Name of your Firm:</label>
              <input
                type="text"
                id="firmName"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            {/* Division Names and Scores */}
            {divisionNames.map((_, index) => (
              <div key={index} className="flex items-center mb-4">
                <label className="w-1/3">Name of Division {index + 1}:</label>
                <input
                  type="text"
                  value={divisionNames[index]}
                  onChange={(e) => setDivisionNames((prevNames) => {
                    const newNames = [...prevNames];
                    newNames[index] = e.target.value;
                    return newNames;
                  })}
                  placeholder={`Division ${index + 1}`}
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-md mr-2"
                />
                <input
                  type="number"
                  value={xAxisScores[index]}
                  onChange={(e) => setXAxisScores((prevScores) => {
                    const newScores = [...prevScores];
                    newScores[index] = e.target.value;
                    return newScores;
                  })}
                  placeholder="X-axis score"
                  className="w-1/6 px-4 py-2 border border-gray-300 rounded-md mr-2"
                />
                <input
                  type="number"
                  value={yAxisScores[index]}
                  onChange={(e) => setYAxisScores((prevScores) => {
                    const newScores = [...prevScores];
                    newScores[index] = e.target.value;
                    return newScores;
                  })}
                  placeholder="Y-axis score"
                  className="w-1/6 px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full mt-8 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


export default Grand;
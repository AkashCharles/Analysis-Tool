import React, { useState } from 'react';




const IE = () => {
  const [data, setData] = useState([{ impact: '', ease: '', impactRating: '', easeRating: '' }]);
  const [submittedData, setSubmittedData] = useState([]);
  const [dbError, setDbError] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [totalScore, setTotalScore] = useState(0);




  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };




  const handleAddField = () => {
    setData([...data, { impact: '', ease: '', impactRating: '', easeRating: '' }]);
  };




  const handleRemoveField = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };




  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Your Firestore logic goes here
      alert("Data saved to Firestore");
      setSubmittedData(data);




      // Calculate total score
      const totalSum = calculateTotalScore();
      setTotalScore(totalSum);
      setShowTable(true);
    } catch (error) {
      console.error("Error adding document: ", error);
      setDbError("Error saving data to Firestore");
    }
  };




  const calculateTotalScore = () => {
    // Calculate total score here
    // This function will be implemented based on your specific requirements
    return 0; // Placeholder, replace with actual implementation
  };




  return (
    <div className="bg-slate-700">
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold text-white mb-8">IE Matrix</h1>
        <form className="max-w-[80vw] w-full bg-white p-8 border border-gray-300 rounded-lg" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            {data.map((item, index) => (
              <div key={index} className="flex gap-2 items-center mb-4">
                <input
                  type="text"
                  value={item.impact}
                  onChange={(e) => handleChange(index, 'impact', e.target.value)}
                  placeholder={`Enter impact ${index + 1}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={item.ease}
                  onChange={(e) => handleChange(index, 'ease', e.target.value)}
                  placeholder={`Enter ease ${index + 1}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  value={item.impactRating}
                  onChange={(e) => handleChange(index, 'impactRating', e.target.value)}
                  placeholder={`Impact Rating ${index + 1}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  value={item.easeRating}
                  onChange={(e) => handleChange(index, 'easeRating', e.target.value)}
                  placeholder={`Ease Rating ${index + 1}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={handleAddField}
                  className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                  +
                </button>
                {data.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField(index)}
                    className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 ml-2"
                  >
                    -
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full mt-8 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </form>
        {dbError && <p className="text-red-500 mt-4">{dbError}</p>}
        {showTable && (
          <div className="mt-8 w-full mx-auto">
            {/* Table display similar to the CSF component */}
            {/* You can implement this based on your specific requirements */}
            <h2 className="text-xl font-bold mb-4">IE Matrix Scores</h2>
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th>Factor</th>
                  <th>Weight</th>
                  <th>Rating A</th>
                  <th>Rating B</th>
                  <th>Rating C</th>
                  {/* Add more headers as needed */}
                </tr>
              </thead>
              <tbody>
                {/* Render table rows here */}
              </tbody>
            </table>
            <p className="mt-4">Total Score: {totalScore}</p>
          </div>
        )}
      </div>
    </div>
  );
};




export default IE;

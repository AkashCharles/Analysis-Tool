import React, { useState } from 'react';

const CSF = () => {
  const factorNames = [
    "Advertising",
    "Market Penetration",
    "Customer Service",
    "Store Locations",
    "R&D",
    "Employee Dedication",
    "Financial Profit",
    "Customer Loyalty",
    "Market Share",
    "Product Quality",
    "Top Management",
    "Price Competitiveness"
  ];

  const initialCsfsData = factorNames.map(name => ({
    factor: name,
    weight: '',
    ratingA: '',
    ratingB: '',
    ratingC: '',
    scoreA: '',
    scoreB: '',
    scoreC: ''
  }));

  const [csfsData, setCsfsData] = useState(initialCsfsData);
  const [totalWeight, setTotalWeight] = useState(0); 
  const [weightValid, setWeightValid] = useState(true); 

  const handleChange = (index, field, value) => {
    const newData = [...csfsData];
    newData[index][field] = value;
    setCsfsData(newData);

    const totalWeightSum = calculateTotalWeight(newData);
    setTotalWeight(totalWeightSum);

    const isValid = totalWeightSum >= 0 && totalWeightSum <= 1;
    setWeightValid(isValid);

    calculateScores(newData);
  };

  const calculateScores = (data) => {
    const updatedData = data.map(csf => ({
      ...csf,
      scoreA: (csf.weight * csf.ratingA).toFixed(2),
      scoreB: (csf.weight * csf.ratingB).toFixed(2),
      scoreC: (csf.weight * csf.ratingC).toFixed(2)
    }));
    setCsfsData(updatedData);
  };

  const calculateTotalWeight = (data) => {
    const totalWeight = data.reduce((total, csf) => total + parseFloat(csf.weight || 0), 0);
    return totalWeight;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (weightValid) {
      try {
        alert("Form submitted successfully!");
      } catch (error) {
        console.error("Error submitting form: ", error);
      }
    } else {
      alert("Total weight should be between 0 and 1.");
    }
  };

  return (
    <div className='bg-slate-700'>
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold text-white mb-8">Critical Success Factors</h1>
        <form className="max-w-[80vw] w-full bg-white p-8 border border-gray-300 rounded-lg" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            {csfsData.map((csf, index) => (
              <div key={index} className="flex gap-10 flex-grow items-center mb-4">
                <span className=" w-64 text-left">{csf.factor}</span>
                <input
                  type="number"
                  value={csf.weight}
                  onChange={(e) => handleChange(index, 'weight', e.target.value)}
                  placeholder={`Weight`}
                  className="w-[10%] px-4 py-2 border border-gray-300 rounded-md"
                />
                <select
                  value={csf.ratingA}
                  onChange={(e) => handleChange(index, 'ratingA', e.target.value)}
                  className="w-[10%] px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Rating A</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
                <span className="w-[13%] px-4 py-2 border border-gray-300 rounded-md">
                  Score A: {csf.scoreA}
                </span>
                <select
                  value={csf.ratingB}
                  onChange={(e) => handleChange(index, 'ratingB', e.target.value)}
                  className="w-[10%] px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Rating B</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
                <span className="w-[13%] px-4 py-2 border border-gray-300 rounded-md">
                  Score B: {csf.scoreB}
                </span>
                <select
                  value={csf.ratingC}
                  onChange={(e) => handleChange(index, 'ratingC', e.target.value)}
                  className="w-[10%] px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Rating C</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>             
                <span className="w-[13%] px-4 py-2 border border-gray-300 rounded-md">
                  Score C: {csf.scoreC}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-start w-full px-8 mt-4">
            <div className="total-score-card bg-white rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Total Weight</h2>
              <p className="text-2xl font-semibold text-green-500">{totalWeight.toFixed(2)}</p>
            </div>
          </div>

          {!weightValid && (
            <div className="text-red-500 text-sm mt-2">Total weight should be between 0 and 1.</div>
          )}
          
          <button
            type="submit"
            className="w-full mt-8 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CSF;

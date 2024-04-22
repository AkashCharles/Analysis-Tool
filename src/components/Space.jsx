import React, { useState } from 'react';

const Space = () => {
  const [firmName, setFirmName] = useState('');
  const [fpData, setFpData] = useState([
    { factor: 'Return on Investment (ROI)', rating: '' },
    { factor: 'Leverage', rating: '' },
    { factor: 'Liquidity', rating: '' },
    { factor: 'Working Capital', rating: '' },
    { factor: 'Cash Flow', rating: '' },
  ]);
  const [ipData, setIpData] = useState([
    { factor: 'Growth Potential', rating: '' },
    { factor: 'Financial Stability', rating: '' },
    { factor: 'Ease of Entry into Market', rating: '' },
    { factor: 'Resource Utilization', rating: '' },
    { factor: 'Profit Potential', rating: '' },
  ]);
  const [cpData, setCpData] = useState([
    { factor: 'Market Share', rating: '' },
    { factor: 'Product Quality', rating: '' },
    { factor: 'Customer Loyalty', rating: '' },
    { factor: 'Technological know-how', rating: '' },
    { factor: 'Control over Suppliers and Distributors', rating: '' },
  ]);
  const [spData, setSpData] = useState([
    { factor: 'Rate of Inflation', rating: '' },
    { factor: 'Technological Changes', rating: '' },
    { factor: 'Price Elasticity of Demand', rating: '' },
    { factor: 'Competitive Pressure', rating: '' },
    { factor: 'Barriers to Entry into Market', rating: '' },
  ]);

  const sumFactors = (data) => {
    return data.reduce((sum, item) => sum + Number(item.rating || 0), 0);
  };

  const calculateXAxis = (ipData, cpData) => {
    const ipSum = sumFactors(ipData);
    const cpSum = sumFactors(cpData);
    return ((ipSum / 5) + (cpSum / 5)).toFixed(2);
  };

  const calculateYAxis = (fpData, spData) => {
    const fpSum = sumFactors(fpData);
    const spSum = sumFactors(spData);
    return ((fpSum / 5) + (spSum / 5)).toFixed(2);
  };

  const [xAxis, setXAxis] = useState(0);
  const [yAxis, setYAxis] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();

  };

  const handleRatingChange = (e, dataType, index) => {
    const newData = [...eval(dataType)];
    newData[index].rating = e.target.value;
    eval('set' + dataType.charAt(0).toUpperCase() + dataType.slice(1))(newData);

    setXAxis(calculateXAxis(ipData, cpData));
    setYAxis(calculateYAxis(fpData, spData));
  };

  const conservativeThreshold = 2.5;
  const defensiveThreshold = 4;
  const aggressiveThreshold = 6;

  const determineCategory = (x, y) => {
    if (x <= conservativeThreshold && y <= conservativeThreshold) {
      return 'Conservative';
    } else if (x <= defensiveThreshold && y > conservativeThreshold) {
      return 'Defensive';
    } else if (x > defensiveThreshold && y <= defensiveThreshold) {
      return 'Aggressive';
    } else {
      return 'Competitive';
    }
  };

  const category = determineCategory(xAxis, yAxis);

  return (
    <div className="bg-slate-700">
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold text-white mb-8">SPACE Matrix</h1>
        <div className="max-w-[80vw] w-full bg-white p-8 border border-gray-300 rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="firmName" className="block mb-2">Enter The Name Of Your Firm:</label>
              <input
                type="text"
                id="firmName"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            {/* Financial Position (FP) */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">Financial Position (FP)</h2>
              {fpData.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <label htmlFor={`fpFactor-${index}`} className="w-1/2">{item.factor}</label>
                  <select
                    id={`fpFactor-${index}`}
                    value={item.rating}
                    onChange={(e) => handleRatingChange(e, 'fpData', index)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select rating</option>
                    {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {/* Industry Position (IP) */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">Industry Position (IP)</h2>
              {ipData.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <label htmlFor={`ipFactor-${index}`} className="w-1/2">{item.factor}</label>
                  <select
                    id={`ipFactor-${index}`}
                    value={item.rating}
                    onChange={(e) => handleRatingChange(e, 'ipData', index)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select rating</option>
                    {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {/* Competitive Position (CP) */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">Competitive Position (CP)</h2>
              {cpData.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <label htmlFor={`cpFactor-${index}`} className="w-1/2">{item.factor}</label>
                  <select
                    id={`cpFactor-${index}`}
                    value={item.rating}
                    onChange={(e) => handleRatingChange(e, 'cpData', index)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select rating</option>
                    {[-1, -2, -3, -4, -5, -6, -7].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {/* Stability Position (SP) */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">Stability Position (SP)</h2>
              {spData.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <label htmlFor={`spFactor-${index}`} className="w-1/2">{item.factor}</label>
                  <select
                    id={`spFactor-${index}`}
                    value={item.rating}
                    onChange={(e) => handleRatingChange(e, 'spData', index)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select rating</option>
                    {[-1, -2, -3, -4, -5, -6, -7].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <p>X-axis: </p>
              <p>Y-axis: </p>
            </div>

            <div className="flex justify-between w-full px-8 mt-8">
              <div className="total-score-card bg-white rounded-lg p-4 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-2">X-Axis</h2>
                <p className="text-2xl font-semibold text-green-500">{xAxis}</p>
              </div>
              <div className="total-score-card bg-white rounded-lg p-4 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Y-Axis</h2>
                <p className="text-2xl font-semibold text-green-500">{yAxis}</p>
              </div>
              <div className="total-score-card bg-white rounded-lg p-4 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Category</h2>
                <p className="text-2xl font-semibold text-green-500">{category}</p>
              </div>
            </div>
            
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


export default Space;

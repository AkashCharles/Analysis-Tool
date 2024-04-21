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


  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit logic here
  };


  const handleRatingChange = (e, dataType, index) => {
    const newData = [...eval(dataType)];
    newData[index].rating = e.target.value;
    eval('set' + dataType.charAt(0).toUpperCase() + dataType.slice(1))(newData);
  };


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
                  <input
                    type="number"
                    id={`fpFactor-${index}`}
                    value={item.rating}
                    onChange={(e) => handleRatingChange(e, 'fpData', index)}
                    placeholder="Rating"
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
            {/* Industry Position (IP) */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">Industry Position (IP)</h2>
              {ipData.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <label htmlFor={`ipFactor-${index}`} className="w-1/2">{item.factor}</label>
                  <input
                    type="number"
                    id={`ipFactor-${index}`}
                    value={item.rating}
                    onChange={(e) => handleRatingChange(e, 'ipData', index)}
                    placeholder="Rating"
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
            {/* Competitive Position (CP) */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">Competitive Position (CP)</h2>
              {cpData.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <label htmlFor={`cpFactor-${index}`} className="w-1/2">{item.factor}</label>
                  <input
                    type="number"
                    id={`cpFactor-${index}`}
                    value={item.rating}
                    onChange={(e) => handleRatingChange(e, 'cpData', index)}
                    placeholder="Rating"
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
            {/* Stability Position (SP) */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">Stability Position (SP)</h2>
              {spData.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <label htmlFor={`spFactor-${index}`} className="w-1/2">{item.factor}</label>
                  <input
                    type="number"
                    id={`spFactor-${index}`}
                    value={item.rating}
                    onChange={(e) => handleRatingChange(e, 'spData', index)}
                    placeholder="Rating"
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                  />
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
        </div>
      </div>
    </div>
  );
};


export default Space;

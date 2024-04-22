import React, { useState, useEffect } from 'react';

const IE = () => {
  const [data, setData] = useState([{ divisionName: '', estimatedIFE: '', estimatedEFE: '' }]);
  const [firmName, setFirmName] = useState('');
  const [ieMatrix, setIEMatrix] = useState([]);

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  useEffect(() => {
    calculateIEMatrix();
  }, [data]);

  const calculateIEMatrix = () => {
    const matrix = data.map(({ estimatedIFE, estimatedEFE }) => ({
      estimatedIFE: parseInt(estimatedIFE),
      estimatedEFE: parseInt(estimatedEFE),
    }));

    const ieMatrix = matrix.map(({ estimatedIFE, estimatedEFE }) => ({
      ieValue: estimatedIFE * estimatedEFE,
      growOrShrink: estimatedIFE > 1 && estimatedEFE > 1 ? 'Grow' : 'Shrink',
    }));

    setIEMatrix(ieMatrix);
  };

  return (
    <div className="bg-slate-700">
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold text-white mb-8">IE Matrix</h1>
        <form className="max-w-[80vw] w-full bg-white p-8 border border-gray-300 rounded-lg">
          <div className="mb-6">
            <label htmlFor="firmName" className="block mb-2 text-gray-800">
              Enter The Name Of Your Firm:
            </label>
            <input
              type="text"
              id="firmName"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          {data.map((item, index) => (
            <div key={index} className="flex gap-2 items-center mb-4">
              <input
                type="text"
                value={item.divisionName}
                onChange={(e) => handleChange(index, 'divisionName', e.target.value)}
                placeholder={`Enter Division Name ${index + 1}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
              <select
                value={item.estimatedIFE}
                onChange={(e) => handleChange(index, 'estimatedIFE', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select IFE</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              <select
                value={item.estimatedEFE}
                onChange={(e) => handleChange(index, 'estimatedEFE', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select EFE</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          ))}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">IE Matrix Results</h2>
            <ul>
              {ieMatrix.map((item, index) => (
                <li key={index}>
                  Division {index + 1}: IE Value - {item.ieValue}, {item.growOrShrink}
                </li>
              ))}
            </ul>
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
  );
};

export default IE;

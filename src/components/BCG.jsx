import React, { useState } from 'react';
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { useEarthoOne } from '@eartho/one-client-react';
import { useNavigate } from 'react-router-dom';

const BCG = () => {
  const [divisionData, setDivisionData] = useState([{ name: '', revenues: '', topFirmRevenues: '', growthRate: '', divisionMarketGrowth: '', category: '' }]);
  const [tableData, setTableData] = useState([]);
  const [dbError, setDbError] = useState(null);
  const db = getFirestore();
  const { user } = useEarthoOne();
  const navigate = useNavigate();

  const handleChange = (index, field, value) => {
    const newData = [...divisionData];
    newData[index][field] = value;
    newData[index].divisionMarketGrowth = parseFloat(newData[index].revenues) / parseFloat(newData[index].topFirmRevenues);
    newData[index].category = categorizeDivision(newData[index]);
    setDivisionData(newData);
    calculateTableData(newData);
  };

  const categorizeDivision = (division) => {
    const marketShare = parseFloat(division.revenues) / parseFloat(division.topFirmRevenues);
    const growthRate = parseFloat(division.growthRate);

    if (marketShare > 0.5 && growthRate > 0.1) {
      return 'Star';
    } else if (marketShare <= 0.5 && growthRate > 0.1) {
      return 'Question Mark';
    } else if (marketShare > 0.5 && growthRate <= 0.1) {
      return 'Cash Cow';
    } else {
      return 'Dog';
    }
  };

  const handleAddField = () => {
    setDivisionData([...divisionData, { name: '', revenues: '', topFirmRevenues: '', growthRate: '', divisionMarketGrowth: '', category: '' }]);
  };

  const handleRemoveField = (index) => {
    const newData = [...divisionData];
    newData.splice(index, 1);
    setDivisionData(newData);
    calculateTableData(newData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const batch = divisionData.map(async (division) =>
        await addDoc(collection(db, "bcgMatrix"), {
          displayName: user.displayName,
          divisionName: division.name,
          divisionRevenues: division.revenues,
          topFirmRevenues: division.topFirmRevenues,
          growthRate: division.growthRate
        })
      );

      await Promise.all(batch);
      alert("Data saved to Firestore");

      calculateTableData(divisionData);
    } catch (error) {
      console.error("Error adding document: ", error);
      setDbError("Error saving data to Firestore");
    }
  };

  const calculateTableData = (data) => {
    const calculatedData = data.map(division => ({
      ...division,
      relativeMarketShare: parseFloat(division.revenues) / parseFloat(division.topFirmRevenues)
    }));
    setTableData(calculatedData);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Star':
        return 'text-green-600';
      case 'Question Mark':
        return 'text-yellow-600';
      case 'Cash Cow':
        return 'text-blue-600';
      case 'Dog':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className='bg-slate-700'>
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold text-white mb-8">Boston Consulting Group (BCG) Matrix</h1>
        <form className="max-w-[80vw] w-full bg-white p-8 border border-gray-300 rounded-lg" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            {divisionData.map((division, index) => (
              <div key={index} className="flex gap-2 items-center mb-4">
                <h3 className="text-base font-semibold mb-2">{index + 1}. <span>{' '}</span></h3>
                <input
                  type="text"
                  value={division.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder={`Enter division name`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  value={division.revenues}
                  onChange={(e) => handleChange(index, 'revenues', e.target.value)}
                  placeholder={`Division Revenues`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  value={division.topFirmRevenues}
                  onChange={(e) => handleChange(index, 'topFirmRevenues', e.target.value)}
                  placeholder={`Top Firm in Industry Division Revenues`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  value={division.growthRate}
                  onChange={(e) => handleChange(index, 'growthRate', e.target.value)}
                  placeholder={`Division Market Growth Rate (%)`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={division.divisionMarketGrowth}
                  placeholder={`Relative market Share position`}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={handleAddField}
                  className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                  +
                </button>
                {divisionData.length > 1 && (
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
          <div className="mt-8 bg-white rounded-lg p-4 shadow-md max-w-[80vw]">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Division Categories:</h2>
          <ul className="list-disc list-inside">
            {divisionData.map((division, index) => (
              <li key={index} className="flex items-center justify-between py-2 border-b border-gray-300">
                <span className="text-gray-700">{division.name}</span>
                <span className={`text-sm font-semibold ${getCategoryColor(division.category)}`}>{division.category}</span>
              </li>
            ))}
          </ul>
        </div>
          <button
            type="submit"
            className="w-full mt-8 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600">
            Submit
          </button>
          {dbError && <p className="text-red-500 mt-4">{dbError}</p>}
        </form>
        
        {/* Table display code */}
      </div>
    </div>
  );
};

export default BCG;

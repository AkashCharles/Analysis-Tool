import React, { useState } from 'react';
import { getFirestore, addDoc, collection } from "firebase/firestore"; 
import { useEarthoOne } from '@eartho/one-client-react';
import { useNavigate } from 'react-router-dom';

const BCGMatrixForm = () => {
  const [divisionData, setDivisionData] = useState([
    { name: '', revenues: '', topFirmRevenues: '', growthRate: '', divisionMarketGrowth: '' },
    { name: '', revenues: '', topFirmRevenues: '', growthRate: '', divisionMarketGrowth: '' },
    { name: '', revenues: '', topFirmRevenues: '', growthRate: '', divisionMarketGrowth: '' },
    { name: '', revenues: '', topFirmRevenues: '', growthRate: '', divisionMarketGrowth: '' },
    { name: '', revenues: '', topFirmRevenues: '', growthRate: '', divisionMarketGrowth: '' }
  ]);
  const [tableData, setTableData] = useState([]);
  const [dbError, setDbError] = useState(null);
  const db = getFirestore();
  const { user } = useEarthoOne();
  const navigate = useNavigate();

  const handleChange = (index, field, value) => {
    const newData = [...divisionData];
    newData[index][field] = value;
    newData[index].divisionMarketGrowth = parseFloat(newData[index].revenues) / parseFloat(newData[index].topFirmRevenues);
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
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full mt-8 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600">
            Submit
          </button>
          {dbError && <p className="text-red-500 mt-4">{dbError}</p>}
        </form>
        {tableData.length > 0 && (
          <div className="mt-8 w-full mx-auto">
            <h2 className="text-xl font-bold mb-4">BCG Matrix Table</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #ccc', padding: '0.5rem', fontWeight: 'bold', textAlign: 'left' }}>Division Name</th>
                  <th style={{ border: '1px solid #ccc', padding: '0.5rem', fontWeight: 'bold', textAlign: 'left' }}>Revenues</th>
                  <th style={{ border: '1px solid #ccc', padding: '0.5rem', fontWeight: 'bold', textAlign: 'left' }}>Top Firm Revenues</th>
                  <th style={{ border: '1px solid #ccc', padding: '0.5rem', fontWeight: 'bold', textAlign: 'left' }}>Growth Rate (%)</th>
                  <th style={{ border: '1px solid #ccc', padding: '0.5rem', fontWeight: 'bold', textAlign: 'left' }}>Division Market Growth Rate</th>
                  <th style={{ border: '1px solid #ccc', padding: '0.5rem', fontWeight: 'bold', textAlign: 'left' }}>Relative Market Share</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent' }}>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>{data.name}</td>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>{data.revenues}</td>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>{data.topFirmRevenues}</td>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>{data.growthRate}</td>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>{data.divisionMarketGrowth}</td>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>{data.relativeMarketShare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {dbError && <p className="text-red-500 mt-4">{dbError}</p>}
      </div>
    </div>
  );
};

export default BCGMatrixForm;

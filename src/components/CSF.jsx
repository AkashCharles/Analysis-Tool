import React, { useState } from 'react';
import { getFirestore, addDoc, collection } from "firebase/firestore"; 
import { useEarthoOne } from '@eartho/one-client-react';
import { Link } from 'react-router-dom';

const CSF = () => {
  const [numOpportunities, setNumOpportunities] = useState('');
  const [opportunitiesData, setOpportunitiesData] = useState([]);
  const [displayParams, setDisplayParams] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const db = getFirestore();
  const {
    user,
  } = useEarthoOne();

  const handleDisplayParams = () => {
    const num = parseInt(numOpportunities);
    if (!isNaN(num)) {
      let newData = [];
      for (let i = 1; i <= num; i++) {
        newData.push({
          factor: '',
          weight: '',
          ratingA: '',
          ratingB: '',
          ratingC: ''
        });
      }
      setOpportunitiesData(newData);
      setDisplayParams(true);
    } else {
      alert('Please enter a valid number for Number of Critical Success Factors.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const opportunityBatch = [];
      
      opportunitiesData.forEach(opportunity => {
        opportunityBatch.push(addDoc(collection(db, "opportunities"), {
          displayName: user.displayName,
          factor: opportunity.factor,
          weight: opportunity.weight,
          ratingA: opportunity.ratingA,
          ratingB: opportunity.ratingB,
          ratingC: opportunity.ratingC
        }));
      });
      
      await Promise.all(opportunityBatch);
      
      alert("Data saved to Firestore");
      
      calculateScore();
      
      setShowTable(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleChange = (index, field, value) => {
    const newData = [...opportunitiesData];
    newData[index][field] = value;
    setOpportunitiesData(newData);
  };

  const calculateScore = () => {
    const calculatedData = opportunitiesData.map(opportunity => {
      const scoreA = parseFloat(opportunity.weight) * parseFloat(opportunity.ratingA);
      const scoreB = parseFloat(opportunity.weight) * parseFloat(opportunity.ratingB);
      const scoreC = parseFloat(opportunity.weight) * parseFloat(opportunity.ratingC);

      return {
        ...opportunity,
        scoreA,
        scoreB,
        scoreC,
      };
    });
    setTableData(calculatedData);
  };

  const calculateTotalScore = (key) => {
    let total = 0;
    tableData.forEach(item => {
      total += parseFloat(item[key]);
    });
    return total.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center bg-gradient-to-r from-red-900  to-blue-950">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Competitive Profile Matrix</h1>
      <div className="flex flex-wrap justify-center">
        <form className="max-w-[30vw] mx-4 bg-white p-8 border border-gray-300 rounded-lg">
          <div className='flex flex-col items-center'>
            <h2 className="text-xl font-bold mb-4">Critical Success Factors</h2>
            <label htmlFor="numOpportunities" className="block mb-2">Number of Critical Success Factors:</label>
            <input
              type="number"
              id="numOpportunities"
              name="numOpportunities"
              value={numOpportunities}
              onChange={(e) => setNumOpportunities(e.target.value)}
              placeholder="Enter number of factors"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
            />

            {displayParams && opportunitiesData.map((opportunity, index) => (
              <div key={index}>
                <label htmlFor={`factor${index + 1}`} className="block mb-2">Factor {index + 1}:</label>
                <input
                  type="text"
                  id={`factor${index + 1}`}
                  name={`factor${index + 1}`}
                  value={opportunity.factor}
                  onChange={(e) => handleChange(index, 'factor', e.target.value)}
                  placeholder={`Enter factor ${index + 1}`}
                  className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                />
                <label htmlFor={`weight${index + 1}`} className="block mb-2">Weight:</label>
                <input
                  type="number"
                  id={`weight${index + 1}`}
                  name={`weight${index + 1}`}
                  value={opportunity.weight}
                  onChange={(e) => handleChange(index, 'weight', e.target.value)}
                  min="1"
                  max="5"
                  placeholder="Enter weight"
                  className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                />
                <label htmlFor={`ratingA${index + 1}`} className="block mb-2">Company A Rating:</label>
                <input
                  type="number"
                  id={`ratingA${index + 1}`}
                  name={`ratingA${index + 1}`}
                  value={opportunity.ratingA}
                  onChange={(e) => handleChange(index, 'ratingA', e.target.value)}
                  min="1"
                  max="5"
                  placeholder="Enter rating for Company A"
                  className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                />
                <label htmlFor={`ratingB${index + 1}`} className="block mb-2">Company B Rating:</label>
                <input
                  type="number"
                  id={`ratingB${index + 1}`}
                  name={`ratingB${index + 1}`}
                  value={opportunity.ratingB}
                  onChange={(e) => handleChange(index, 'ratingB', e.target.value)}
                  min="1"
                  max="5"
                  placeholder="Enter rating for Company B"
                  className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                />
                <label htmlFor={`ratingC${index + 1}`} className="block mb-2">Company C Rating:</label>
                <input
                  type="number"
                  id={`ratingC${index + 1}`}
                  name={`ratingC${index + 1}`}
                  value={opportunity.ratingC}
                  onChange={(e) => handleChange(index, 'ratingC', e.target.value)}
                  min="1"
                  max="5"
                  placeholder="Enter rating for Company C"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={displayParams ? handleSubmit : handleDisplayParams}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {displayParams ? 'Submit' : 'Display Parameters'}
          </button>
        </form>
      </div>

      {showTable && (
        <div className="mt-8 mx-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company A Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score A</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company B Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score B</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company C Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score C</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{item.factor}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.weight}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.ratingA}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.scoreA}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.ratingB}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.scoreB}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.ratingC}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.scoreC}</td>
                </tr>
              ))}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">Total Score</td>
                <td></td>
                <td></td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{calculateTotalScore('scoreA')}</td>
                <td></td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{calculateTotalScore('scoreB')}</td>
                <td></td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{calculateTotalScore('scoreC')}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 flex justify-center">
            <Link to="/bcg-page" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Go to csf Pages
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSF;

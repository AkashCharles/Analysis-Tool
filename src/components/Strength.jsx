import React, { useState } from 'react';
import { getFirestore, addDoc, collection } from "firebase/firestore"; 
import { useEarthoOne } from '@eartho/one-client-react';
import { Link } from 'react-router-dom';

const Strength = () => {
  const [numStrengths, setNumStrengths] = useState('');
  const [strengthsData, setStrengthsData] = useState([]);
  const [displayParams, setDisplayParams] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [numWeaknesses, setNumWeaknesses] = useState('');
  const [weaknessesData, setWeaknessesData] = useState([]);
  const [displayWeaknessParams, setDisplayWeaknessParams] = useState(false);
  const [weaknessTableData, setWeaknessTableData] = useState([]);
  const [showWeaknessTable, setShowWeaknessTable] = useState(false);
  const db = getFirestore();
  const {
    user,
  } = useEarthoOne();

  const handleDisplayParams = () => {
    const num = parseInt(numStrengths);
    if (!isNaN(num)) {
      let newData = [];
      for (let i = 1; i <= num; i++) {
        newData.push({
          strength: '',
          weight: '',
          rating: ''
        });
      }
      setStrengthsData(newData);
      setDisplayParams(true);
    } else {
      alert('Please enter a valid number for Number of Strengths.');
    }
  };

  const handleWeaknessDisplayParams = () => {
    const num = parseInt(numWeaknesses);
    if (!isNaN(num)) {
      let newData = [];
      for (let i = 1; i <= num; i++) {
        newData.push({
          weakness: '',
          weight: '',
          rating: ''
        });
      }
      setWeaknessesData(newData);
      setDisplayWeaknessParams(true);
    } else {
      alert('Please enter a valid number for Number of Weaknesses.');
    }
  };

  const calculateScore = () => {
    const calculatedData = strengthsData.map(strength => ({
      ...strength,
      score: parseFloat(strength.weight) * parseInt(strength.rating)
    }));
    const totalStrengthScore = calculatedData.reduce((total, item) => total + item.score, 0);
    setTableData(calculatedData);
    return totalStrengthScore;
  };

  const calculateWeaknessScore = () => {
    const calculatedData = weaknessesData.map(weakness => ({
      ...weakness,
      score: parseFloat(weakness.weight) * parseInt(weakness.rating)
    }));
    const totalWeaknessScore = calculatedData.reduce((total, item) => total + item.score, 0);
    setWeaknessTableData(calculatedData);
    return totalWeaknessScore;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const strengthBatch = [];
      const weaknessBatch = [];
      
      strengthsData.forEach(strength => {
        strengthBatch.push(addDoc(collection(db, "strengths"), {
          displayName: user.displayName, 
          strength: strength.strength,
          weight: strength.weight,
          rating: strength.rating
        }));
      });
      
      weaknessesData.forEach(weakness => {
        weaknessBatch.push(addDoc(collection(db, "weaknesses"), {
          displayName: user.displayName, 
          weakness: weakness.weakness,
          weight: weakness.weight,
          rating: weakness.rating
        }));
      });
      
      await Promise.all(strengthBatch);
      await Promise.all(weaknessBatch);
      
      alert("Data saved to Firestore");
      
      const totalStrengthScore = calculateScore();
      const totalWeaknessScore = calculateWeaknessScore();
      
      const totalSum = totalStrengthScore + totalWeaknessScore;
      
      setShowTable(true);
      setShowWeaknessTable(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleChange = (index, field, value, isStrength) => {
    const newData = isStrength ? [...strengthsData] : [...weaknessesData];
    newData[index][field] = value;
    isStrength ? setStrengthsData(newData) : setWeaknessesData(newData);
  };

  return (
    <div className='='>
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center bg-gradient-to-r from-red-900  to-blue-950">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Internal Factor Evaluation</h1>
      <div className="flex flex-wrap justify-center">
        <form className="max-w-[30vw] mx-4 bg-white p-8 border border-gray-300 rounded-lg">
          <div className='flex gap-3'>
            <div  className='flex flex-col items-center'>
              <h2 className="text-xl font-bold mb-4">Strengths</h2>
              <label htmlFor="numStrengths" className="block mb-2">Number of Strengths:</label>
              <input
                type="number"
                id="numStrengths"
                name="numStrengths"
                value={numStrengths}
                onChange={(e) => setNumStrengths(e.target.value)}
                placeholder="Enter number of strengths"
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
              />

              {displayParams && strengthsData.map((strength, index) => (
                <div key={index}>
                  <label htmlFor={`strength${index + 1}`} className="block mb-2">Strength {index + 1}:</label>
                  <input
                    type="text"
                    id={`strength${index + 1}`}
                    name={`strength${index + 1}`}
                    value={strength.strength}
                    onChange={(e) => handleChange(index, 'strength', e.target.value, true)}
                    placeholder={`Enter strength ${index + 1}`}
                    className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                  />
                  <label htmlFor={`strengthWeight${index + 1}`} className="block mb-2">Weight:</label>
                  <input
                    type="number"
                    id={`strengthWeight${index + 1}`}
                    name={`strengthWeight${index + 1}`}
                    value={strength.weight}
                    onChange={(e) => handleChange(index, 'weight', e.target.value, true)}
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="Enter weight (0-1)"
                    className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                  />
                  <label htmlFor={`strengthRating${index + 1}`} className="block mb-2">Rating:</label>
                  <input
                    type="number"
                    id={`strengthRating${index + 1}`}
                    name={`strengthRating${index + 1}`}
                    value={strength.rating}
                    onChange={(e) => handleChange(index, 'rating', e.target.value, true)}
                    min="1"
                    max="4"
                    placeholder="Enter rating (1-4)"
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div> 
            <div className='flex flex-col items-center'>
              <h2 className="text-xl font-bold mb-4 ">Weaknesses</h2>
              <label htmlFor="numWeaknesses" className="block mb-2">Number of Weaknesses:</label>
              <input
                type="number"
                id="numWeaknesses"
                name="numWeaknesses"
                value={numWeaknesses}
                onChange={(e) => setNumWeaknesses(e.target.value)}
                placeholder="Enter number of weaknesses"
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
              />

              {displayWeaknessParams && weaknessesData.map((weakness, index) => (
                <div key={index}>
                  <label htmlFor={`weakness${index + 1}`} className="block mb-2">Weakness {index + 1}:</label>
                  <input
                    type="text"
                    id={`weakness${index + 1}`}
                    name={`weakness${index + 1}`}
                    value={weakness.weakness}
                    onChange={(e) => handleChange(index, 'weakness', e.target.value, false)}
                    placeholder={`Enter weakness ${index + 1}`}
                    className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                  />
                  <label htmlFor={`weaknessWeight${index + 1}`} className="block mb-2">Weight:</label>
                  <input
                    type="number"
                    id={`weaknessWeight${index + 1}`}
                    name={`weaknessWeight${index + 1}`}
                    value={weakness.weight}
                    onChange={(e) => handleChange(index, 'weight', e.target.value, false)}
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="Enter weight (0-1)"
                    className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                  />
                  <label htmlFor={`weaknessRating${index + 1}`} className="block mb-2">Rating:</label>
                  <input
                    type="number"
                    id={`weaknessRating${index + 1}`}
                    name={`weaknessRating${index + 1}`}
                    value={weakness.rating}
                    onChange={(e) => handleChange(index, 'rating', e.target.value, false)}
                    min="1"
                    max="4"
                    placeholder="Enter rating (1-4)"
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={displayParams ? handleSubmit : () => {
              handleDisplayParams();
              handleWeaknessDisplayParams();
            }}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {displayParams ? 'Submit' : 'Display Parameters'}
          </button>
        </form>
      </div>

      {(showTable || showWeaknessTable) && (
        <div className="mt-8 mx-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.no</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">Strength</td>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.strength}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.weight}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.score}</td>
                </tr>
              ))}
              {weaknessTableData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">Weakness</td>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.weakness}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.weight}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.score}</td>
                </tr>
              ))}
              <tr className="bg-gray-100">
                <td colSpan="5" className="px-6 py-4 text-right font-bold">Total Sum</td>
                <td className="px-6 py-4 whitespace-nowrap font-bold">
                  {tableData.reduce((total, item) => total + item.score, 0) + weaknessTableData.reduce((total, item) => total + item.score, 0)}
                </td>
              </tr> 
            </tbody>
          </table>
          <div className="mt-4 flex justify-center">
            <Link to="/other-page" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Go to Other Page
            </Link>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Strength;
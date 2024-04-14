import React, { useEffect, useState } from 'react';
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

  const [backgroundPosition, setBackgroundPosition] = useState(30);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (backgroundPosition <= 20) {
        setDirection(1);
      } else if (backgroundPosition >=70) {
        setDirection(-1);
      }
      setBackgroundPosition(prevPosition => prevPosition + direction);
    }, 100);

    return () => clearInterval(intervalId);
  }, [backgroundPosition, direction]);

  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, #E6085D 30%, #1047C6 80%)`,
    backgroundPosition: `${backgroundPosition}% 50%`,
    backgroundSize: '400% 400%',
  };

  return (
    <div className="min-h-screen flex flex-col justify-center" style={gradientStyle}>
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Internal Factor Evaluation</h1>
      <div className="flex flex-wrap justify-center">
        <form className="max-w-[30vw] mx-4 bg-white p-8 border border-gray-300 rounded-lg">
          <div>
            <div className='flex flex-col items-center'>
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
              {displayParams && (
                <div className="flex flex-col gap-2">
                  {strengthsData.map((strength, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        id={`strength${index + 1}`}
                        name={`strength${index + 1}`}
                        value={strength.strength}
                        onChange={(e) => handleChange(index, 'strength', e.target.value, true)}
                        placeholder={`Enter strength ${index + 1}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="number"
                        id={`strengthWeight${index + 1}`}
                        name={`strengthWeight${index + 1}`}
                        value={strength.weight}
                        onChange={(e) => handleChange(index, 'weight', e.target.value, true)}
                        placeholder={`Weight ${index + 1}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="number"
                        id={`strengthRating${index + 1}`}
                        name={`strengthRating${index + 1}`}
                        value={strength.rating}
                        onChange={(e) => handleChange(index, 'rating', e.target.value, true)}
                        placeholder={`Rating ${index + 1}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
              {!displayParams && (
                <button
                  type="button"
                  onClick={handleDisplayParams}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Add Strengths
                </button>
              )}
            </div>

            <div className='flex flex-col items-center mt-8'>
              <h2 className="text-xl font-bold mb-4">Weaknesses</h2>
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
              {displayWeaknessParams && (
                <div className="flex flex-col gap-2">
                  {weaknessesData.map((weakness, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        id={`weakness${index + 1}`}
                        name={`weakness${index + 1}`}
                        value={weakness.weakness}
                        onChange={(e) => handleChange(index, 'weakness', e.target.value, false)}
                        placeholder={`Enter weakness ${index + 1}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="number"
                        id={`weaknessWeight${index + 1}`}
                        name={`weaknessWeight${index + 1}`}
                        value={weakness.weight}
                        onChange={(e) => handleChange(index, 'weight', e.target.value, false)}
                        placeholder={`Weight ${index + 1}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="number"
                        id={`weaknessRating${index + 1}`}
                        name={`weaknessRating${index + 1}`}
                        value={weakness.rating}
                        onChange={(e) => handleChange(index, 'rating', e.target.value, false)}
                        placeholder={`Rating ${index + 1}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
              {!displayWeaknessParams && (
                <button
                  type="button"
                  onClick={handleWeaknessDisplayParams}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Add Weaknesses
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full mt-8 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div>

      {(showTable || showWeaknessTable) && (
        <div className="mt-8 mx-auto">
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200 border border-gray-400">
                <th className="px-4 py-2">Strength/Weakness</th>
                <th className="px-4 py-2">Weight</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {showTable &&
                tableData.map((strength, index) => (
                  <tr key={index} className="border border-gray-400">
                    <td className="px-4 py-2">{strength.strength}</td>
                    <td className="px-4 py-2">{strength.weight}</td>
                    <td className="px-4 py-2">{strength.rating}</td>
                    <td className="px-4 py-2">{strength.score}</td>
                  </tr>
                ))}
              {showWeaknessTable &&
                weaknessTableData.map((weakness, index) => (
                  <tr key={index} className="border border-gray-400">
                    <td className="px-4 py-2">{weakness.weakness}</td>
                    <td className="px-4 py-2">{weakness.weight}</td>
                    <td className="px-4 py-2">{weakness.rating}</td>
                    <td className="px-4 py-2">{weakness.score}</td>
                  </tr>
                ))}
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
  );
};

export default Strength;

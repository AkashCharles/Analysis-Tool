import React, { useEffect, useState } from 'react';
import { getFirestore, addDoc, collection } from "firebase/firestore"; 
import { useEarthoOne } from '@eartho/one-client-react';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';



const Strength = () => {
  const [strengthsData, setStrengthsData] = useState(getStoredData('strengths') || [{ strength: '', weight: '', rating: '' }]);
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [weaknessesData, setWeaknessesData] = useState(getStoredData('weaknesses') || [{ weakness: '', weight: '', rating: '' }]);
  const [weaknessTableData, setWeaknessTableData] = useState([]);
  const [showWeaknessTable, setShowWeaknessTable] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const db = getFirestore();
  const { user } = useEarthoOne();
  const navigate = useNavigate();


  const handleChange = (index, field, value, isStrength) => {
    const newData = isStrength ? [...strengthsData] : [...weaknessesData];
    newData[index][field] = value;
    isStrength ? setStrengthsData(newData) : setWeaknessesData(newData);
  };

  const handleAddField = (isStrength) => {
    const newData = isStrength ? [...strengthsData, { strength: '', weight: '', rating: '' }] : [...weaknessesData, { weakness: '', weight: '', rating: '' }];
    isStrength ? setStrengthsData(newData) : setWeaknessesData(newData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const strengthBatch = strengthsData.map(async (strength) =>
        await addDoc(collection(db, "strengths"), {
          displayName: user.displayName,
          strength: strength.strength,
          weight: strength.weight,
          rating: strength.rating
        })
      );

      const weaknessBatch = weaknessesData.map(async (weakness) =>
        await addDoc(collection(db, "weaknesses"), {
          displayName: user.displayName,
          weakness: weakness.weakness,
          weight: weakness.weight,
          rating: weakness.rating
        })
      );

      await Promise.all([...strengthBatch, ...weaknessBatch]);
      alert("Data saved to Firestore");

      const totalStrengthScore = calculateScore(strengthsData);
      const totalWeaknessScore = calculateScore(weaknessesData);
      const totalSum = totalStrengthScore + totalWeaknessScore;

      setTotalScore(totalSum);

      const updatedTableData = strengthsData.map((strength) => ({
        ...strength,
        score: parseFloat(strength.weight) * parseInt(strength.rating)
      }));
      setTableData(updatedTableData);

      const updatedWeaknessTableData = weaknessesData.map((weakness) => ({
        ...weakness,
        score: parseFloat(weakness.weight) * parseInt(weakness.rating)
      }));
      setWeaknessTableData(updatedWeaknessTableData);

      setShowTable(true);
      setShowWeaknessTable(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const calculateScore = (data) => {
    const calculatedData = data.map(item => ({
      ...item,
      score: parseFloat(item.weight) * parseInt(item.rating)
    }));
    const totalScore = calculatedData.reduce((total, item) => total + item.score, 0);
    return totalScore;
  };

  const [clickedWord, setClickedWord] = useState('');

  const words = ['IFE', 'EFE', 'Word3', 'Word4', 'Word5', 'Word6', 'Word7', 'Word8'];

  const handleButtonClick = (page) => {
    navigate(page); 
  };

  useEffect(() => { 
    localStorage.setItem('strengths', JSON.stringify(strengthsData));
    localStorage.setItem('weaknesses', JSON.stringify(weaknessesData));
  }, [strengthsData, weaknessesData]);

  function getStoredData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  return (
    <div className='bg-slate-700 min-h-screen'>
      <div className='py-4'>
        <Navbar />
        </div>
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 my-8">
        {words.map((word, index) => (
          <button
            key={index}
            className={`px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none ${
              clickedWord === word ? 'font-bold' : ''
            }`}
            onClick={() => {
              if (word === 'IFE') {
                handleButtonClick('/strength-page'); 
              } if (word === 'EFE') {
                handleButtonClick('/other-page'); 
              }
            }}
          >
            {word}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold text-white mb-8">Internal Factor Evaluation</h1>
        <form className="max-w-[40vw] w-full bg-white p-8 border border-gray-300 rounded-lg" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <div className="w-full mb-8">
              <h2 className="text-xl font-bold mb-4">Strengths</h2>
              {strengthsData.map((strength, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={strength.strength}
                    onChange={(e) => handleChange(index, 'strength', e.target.value, true)}
                    placeholder={`Enter strength ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  />
                  <input
                    type="number"
                    value={strength.weight}
                    onChange={(e) => handleChange(index, 'weight', e.target.value, true)}
                    placeholder={`Weight ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  />
                  <input
                    type="number"
                    value={strength.rating}
                    onChange={(e) => handleChange(index, 'rating', e.target.value, true)}
                    placeholder={`Rating ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  />
                  {index === strengthsData.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleAddField(true)}
                      className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="w-full">
              <h2 className="text-xl font-bold mb-4">Weaknesses</h2>
              {weaknessesData.map((weakness, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={weakness.weakness}
                    onChange={(e) => handleChange(index, 'weakness', e.target.value, false)}
                    placeholder={`Enter weakness ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    value={weakness.weight}
                    onChange={(e) => handleChange(index, 'weight', e.target.value, false)}
                    placeholder={`Weight ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    value={weakness.rating}
                    onChange={(e) => handleChange(index, 'rating', e.target.value, false)}
                    placeholder={`Rating ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                  {index === weaknessesData.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleAddField(false)}
                      className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </form>

        {(showTable || showWeaknessTable) && (
          <div className="mt-8 w-full mx-auto">
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
                  tableData.map((item, index) => (
                    <tr key={index} className="border border-gray-400">
                      <td className="px-4 py-2">{item.strength}</td>
                      <td className="px-4 py-2">{item.weight}</td>
                      <td className="px-4 py-2">{item.rating}</td>
                      <td className="px-4 py-2">{item.score}</td>
                    </tr>
                  ))}
                {showWeaknessTable &&
                  weaknessTableData.map((item, index) => (
                    <tr key={index} className="border border-gray-400">
                      <td className="px-4 py-2">{item.weakness}</td>
                      <td className="px-4 py-2">{item.weight}</td>
                      <td className="px-4 py-2">{item.rating}</td>
                      <td className="px-4 py-2">{item.score}</td>
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

        <div className="mt-4 text-white">
          Total Score: {totalScore}
        </div>
      </div>
    </div>
  );
};

export default Strength;

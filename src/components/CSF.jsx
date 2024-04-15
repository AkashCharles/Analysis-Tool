import React, { useEffect, useState } from 'react';
import { getFirestore, addDoc, collection } from "firebase/firestore"; 
import { useEarthoOne } from '@eartho/one-client-react';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';

const CSF = () => {
  const [csfsData, setCsfsData] = useState(getStoredData('csf') || [{ factor: '', weight: '', ratingA: '', ratingB: '', ratingC: '' }]);
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const db = getFirestore();
  const { user } = useEarthoOne();
  const navigate = useNavigate();

  const handleChange = (index, field, value) => {
    const newData = [...csfsData];
    newData[index][field] = value;
    setCsfsData(newData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const batch = csfsData.map(async (csf) =>
        await addDoc(collection(db, "csf"), {
          displayName: user.displayName,
          factor: csf.factor,
          weight: csf.weight,
          ratingA: csf.ratingA,
          ratingB: csf.ratingB,
          ratingC: csf.ratingC
        })
      );

      await Promise.all(batch);
      alert("Data saved to Firestore");

      calculateScore();
      setShowTable(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const calculateScore = () => {
    const calculatedData = csfsData.map(csf => ({
      ...csf,
      scoreA: parseFloat(csf.weight) * parseFloat(csf.ratingA),
      scoreB: parseFloat(csf.weight) * parseFloat(csf.ratingB),
      scoreC: parseFloat(csf.weight) * parseFloat(csf.ratingC)
    }));
    setTableData(calculatedData);
  };

  useEffect(() => {
    localStorage.setItem('csf', JSON.stringify(csfsData));
  }, [csfsData]);
  
  const [clickedWord, setClickedWord] = useState('');

  const words = ['IFE', 'EFE', 'CSF', 'Word4', 'Word5', 'Word6', 'Word7', 'Word8'];

  const handleButtonClick = (page) => {
    navigate(page); 
  };

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
            {csfsData.map((csf, index) => (
              <div key={index} className="flex gap-2 items-center mb-4">
                <input
                  type="text"
                  value={csf.factor}
                  onChange={(e) => handleChange(index, 'factor', e.target.value)}
                  placeholder={`Enter factor ${index + 1}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  value={csf.weight}
                  onChange={(e) => handleChange(index, 'weight', e.target.value)}
                  placeholder={`Weight`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  value={csf.ratingA}
                  onChange={(e) => handleChange(index, 'ratingA', e.target.value)}
                  placeholder={`Rating A`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  value={csf.ratingB}
                  onChange={(e) => handleChange(index, 'ratingB', e.target.value)}
                  placeholder={`Rating B`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  value={csf.ratingC}
                  onChange={(e) => handleChange(index, 'ratingC', e.target.value)}
                  placeholder={`Rating C`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                {index === csfsData.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setCsfsData([...csfsData, { factor: '', weight: '', ratingA: '', ratingB: '', ratingC: '' }])}
                    className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                  >
                    +
                  </button>
                )}
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

        {showTable && (
          <div className="mt-8 w-full mx-auto">
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th>Factor</th>
                  <th>Weight</th>
                  <th>Rating A</th>
                  <th>Rating B</th>
                  <th>Rating C</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.factor}</td>
                    <td>{data.weight}</td>
                    <td>{data.ratingA}</td>
                    <td>{data.ratingB}</td>
                    <td>{data.ratingC}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

function getStoredData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [{ factor: '', weight: '', ratingA: '', ratingB: '', ratingC: '' }];
}

export default CSF;

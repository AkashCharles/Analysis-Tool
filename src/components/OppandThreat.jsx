import React, { useEffect, useState } from 'react';
import { getFirestore, addDoc, collection } from "firebase/firestore"; 
import { useEarthoOne } from '@eartho/one-client-react';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';

const OppandThreat = () => {
  const [opportunitiesData, setOpportunitiesData] = useState(getStoredData('opportunities') || [{ opportunity: '', weight: '', rating: '' }]);
  const [opportunityTableData, setOpportunityTableData] = useState([]);
  const [showOpportunityTable, setShowOpportunityTable] = useState(false);
  const [threatsData, setThreatsData] = useState(getStoredData('threats') || [{ threat: '', weight: '', rating: '' }]);
  const [threatTableData, setThreatTableData] = useState([]);
  const [showThreatTable, setShowThreatTable] = useState(false);
  const [totalScore, setTotalScore] = useState(0); 
  const [ifeChecked, setIFEChecked] = useState(false);
  const db = getFirestore();
  const { user } = useEarthoOne();
  const navigate = useNavigate();

  useEffect(() => {
    const storedIFEChecked = localStorage.getItem('ifeChecked');
    if (storedIFEChecked) {
      setIFEChecked(true);
    }
  }, []);

  const handleChange = (index, field, value, isOpportunity) => {
    const newData = isOpportunity ? [...opportunitiesData] : [...threatsData];
    newData[index][field] = value;
    isOpportunity ? setOpportunitiesData(newData) : setThreatsData(newData);
  };

  const handleAddField = (isOpportunity) => {
    const newData = isOpportunity ? [...opportunitiesData, { opportunity: '', weight: '', rating: '' }] : [...threatsData, { threat: '', weight: '', rating: '' }];
    isOpportunity ? setOpportunitiesData(newData) : setThreatsData(newData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const opportunityBatch = opportunitiesData.map(async (opportunity) =>
        await addDoc(collection(db, "opportunities"), {
          displayName: user.displayName,
          opportunity: opportunity.opportunity,
          weight: opportunity.weight,
          rating: opportunity.rating
        })
      );

      const threatBatch = threatsData.map(async (threat) =>
        await addDoc(collection(db, "threats"), {
          displayName: user.displayName,
          threat: threat.threat,
          weight: threat.weight,
          rating: threat.rating
        })
      );

      await Promise.all([...opportunityBatch, ...threatBatch]);
      alert("Data saved to Firestore");

      // Calculate total scores
      const totalOpportunityScore = calculateScore(opportunitiesData);
      const totalThreatScore = calculateScore(threatsData);
      const totalSum = totalOpportunityScore + totalThreatScore;

      // Set the total score state
      setTotalScore(totalSum);

      // Set the table data based on the submitted data
      const updatedOpportunityTableData = opportunitiesData.map((opportunity) => ({
        ...opportunity,
        score: parseFloat(opportunity.weight) * parseInt(opportunity.rating)
      }));
      setOpportunityTableData(updatedOpportunityTableData);

      const updatedThreatTableData = threatsData.map((threat) => ({
        ...threat,
        score: parseFloat(threat.weight) * parseInt(threat.rating)
      }));
      setThreatTableData(updatedThreatTableData);

      setShowOpportunityTable(true);
      setShowThreatTable(true);
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

  const words = ['IFE', 'EFE', 'CSF', 'Word4', 'Word5', 'Word6', 'Word7', 'Word8'];

  const handleButtonClick = (page) => {
    navigate(page); 
  };

  useEffect(() => { 
    localStorage.setItem('opportunities', JSON.stringify(opportunitiesData));
    localStorage.setItem('threats', JSON.stringify(threatsData));
  }, [opportunitiesData, threatsData]);

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
              } if (word === 'CSF') {
                handleButtonClick('/csf-page'); 
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
              <h2 className="text-xl font-bold mb-4">Opportunities</h2>
              {opportunitiesData.map((opportunity, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={opportunity.opportunity}
                    onChange={(e) => handleChange(index, 'opportunity', e.target.value, true)}
                    placeholder={`Enter opportunity ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  />
                  <input
                    type="number"
                    value={opportunity.weight}
                    onChange={(e) => handleChange(index, 'weight', e.target.value, true)}
                    placeholder={`Weight ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  />
                  <input
                    type="number"
                    value={opportunity.rating}
                    onChange={(e) => handleChange(index, 'rating', e.target.value, true)}
                    placeholder={`Rating ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  />
                  {index === opportunitiesData.length - 1 && (
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
              <h2 className="text-xl font-bold mb-4">Threats</h2>
              {threatsData.map((threat, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={threat.threat}
                    onChange={(e) => handleChange(index, 'threat', e.target.value, false)}
                    placeholder={`Enter threat ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    value={threat.weight}
                    onChange={(e) => handleChange(index, 'weight', e.target.value, false)}
                    placeholder={`Weight ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    value={threat.rating}
                    onChange={(e) => handleChange(index, 'rating', e.target.value, false)}
                    placeholder={`Rating ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                  {index === threatsData.length - 1 && (
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

        {(showOpportunityTable || showThreatTable) && (
          <div className="mt-8 w-full mx-auto">
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200 border border-gray-400">
                  <th className="px-4 py-2">Opportunity/Threat</th>
                  <th className="px-4 py-2">Weight</th>
                  <th className="px-4 py-2">Rating</th>
                  <th className="px-4 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {showOpportunityTable &&
                  opportunityTableData.map((item, index) => (
                    <tr key={index} className="border border-gray-400">
                      <td className="px-4 py-2">{item.opportunity}</td>
                      <td className="px-4 py-2">{item.weight}</td>
                      <td className="px-4 py-2">{item.rating}</td>
                      <td className="px-4 py-2">{item.score}</td>
                    </tr>
                  ))}
                {showThreatTable &&
                  threatTableData.map((item, index) => (
                    <tr key={index} className="border border-gray-400">
                      <td className="px-4 py-2">{item.threat}</td>
                      <td className="px-4 py-2">{item.weight}</td>
                      <td className="px-4 py-2">{item.rating}</td>
                      <td className="px-4 py-2">{item.score}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-center">
              <Link to="/csf-page" className="bg-blue-500 text-white px-4 py-2 rounded-md">
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

export default OppandThreat;

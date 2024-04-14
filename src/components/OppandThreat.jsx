import React, {useEffect, useState } from 'react';
import { getFirestore, addDoc, collection } from "firebase/firestore"; 
import { useEarthoOne } from '@eartho/one-client-react';
import { Link } from 'react-router-dom';

const OppandThreat = () => {
  const [numOpportunities, setNumOpportunities] = useState('');
  const [opportunitiesData, setOpportunitiesData] = useState([]);
  const [displayParams, setDisplayParams] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [numThreats, setNumThreats] = useState('');
  const [threatsData, setThreatsData] = useState([]);
  const [displayThreatParams, setDisplayThreatParams] = useState(false);
  const [threatTableData, setThreatTableData] = useState([]);
  const [showThreatTable, setShowThreatTable] = useState(false);
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
          opportunity: '',
          weight: '',
          rating: ''
        });
      }
      setOpportunitiesData(newData);
      setDisplayParams(true);
    } else {
      alert('Please enter a valid number for Number of Opportunities.');
    }
  };

  const handleThreatDisplayParams = () => {
    const num = parseInt(numThreats);
    if (!isNaN(num)) {
      let newData = [];
      for (let i = 1; i <= num; i++) {
        newData.push({
          threat: '',
          weight: '',
          rating: ''
        });
      }
      setThreatsData(newData);
      setDisplayThreatParams(true);
    } else {
      alert('Please enter a valid number for Number of Threats.');
    }
  };

  const calculateScore = (isOpportunity) => {
    const data = isOpportunity ? opportunitiesData : threatsData;
    const calculatedData = data.map(item => ({
      ...item,
      score: parseFloat(item.weight) * parseInt(item.rating)
    }));
    const totalScore = calculatedData.reduce((total, item) => total + item.score, 0);
    isOpportunity ? setTableData(calculatedData) : setThreatTableData(calculatedData);
    return totalScore;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const opportunityBatch = [];
      const threatBatch = [];
      
      opportunitiesData.forEach(opportunity => {
        opportunityBatch.push(addDoc(collection(db, "opportunities"), {
          displayName: user.displayName,
          opportunity: opportunity.opportunity,
          weight: opportunity.weight,
          rating: opportunity.rating
        }));
      });
      
      threatsData.forEach(threat => {
        threatBatch.push(addDoc(collection(db, "threats"), {
          displayName: user.displayName,
          threat: threat.threat,
          weight: threat.weight,
          rating: threat.rating
        }));
      });
      
      await Promise.all(opportunityBatch);
      await Promise.all(threatBatch);
      
      alert("Data saved to Firestore");
      
      const totalOpportunityScore = calculateScore(true);
      const totalThreatScore = calculateScore(false);
      
      const totalSum = totalOpportunityScore + totalThreatScore;
      
      setShowTable(true);
      setShowThreatTable(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleChange = (index, field, value, isOpportunity) => {
    const newData = isOpportunity ? [...opportunitiesData] : [...threatsData];
    newData[index][field] = value;
    isOpportunity ? setOpportunitiesData(newData) : setThreatsData(newData);
  };

  const [backgroundPosition, setBackgroundPosition] = useState(30);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (backgroundPosition <= 20) {
        setDirection(1);
      } else if (backgroundPosition >= 70) {
        setDirection(-1);
      }
      setBackgroundPosition(prevPosition => prevPosition + direction);
    }, 100);

    return () => clearInterval(intervalId);
  }, [backgroundPosition, direction]);

  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, #6A0DAD 30%, #A93226 80%)`,
    backgroundPosition: `${backgroundPosition}% 50%`,
    backgroundSize: '400% 400%',
  };



  return (
    <div className=''>
      <div className="min-h-screen flex flex-col justify-center" style={gradientStyle}>
      
        <h1 className="text-3xl font-bold text-center mb-8 text-white">External Factor Evaluation</h1>
        <div className="flex flex-wrap justify-center">
          <form className="max-w-[30vw] mx-4 bg-white p-8 border border-gray-300 rounded-lg">
            <div className='flex gap-3'>
              <div className='flex flex-col items-center'>
                <h2 className="text-xl font-bold mb-4">Opportunities</h2>
                <label htmlFor="numOpportunities" className="block mb-2">Number of Opportunities:</label>
                <input
                  type="number"
                  id="numOpportunities"
                  name="numOpportunities"
                  value={numOpportunities}
                  onChange={(e) => setNumOpportunities(e.target.value)}
                  placeholder="Enter number of opportunities"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                />

                {displayParams && opportunitiesData.map((opportunity, index) => (
                  <div key={index} className="flex gap-3">
                    <div>
                      <label htmlFor={`opportunity${index + 1}`} className="block mb-2">Opportunity {index + 1}:</label>
                      <input
                        type="text"
                        id={`opportunity${index + 1}`}
                        name={`opportunity${index + 1}`}
                        value={opportunity.opportunity}
                        onChange={(e) => handleChange(index, 'opportunity', e.target.value, true)}
                        placeholder={`Enter opportunity ${index + 1}`}
                        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor={`opportunityWeight${index + 1}`} className="block mb-2">Weight:</label>
                      <input
                        type="number"
                        id={`opportunityWeight${index + 1}`}
                        name={`opportunityWeight${index + 1}`}
                        value={opportunity.weight}
                        onChange={(e) => handleChange(index, 'weight', e.target.value, true)}
                        step="0.01"
                        min="0"
                        max="1"
                        placeholder="Enter weight (0-1)"
                        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor={`opportunityRating${index + 1}`} className="block mb-2">Rating:</label>
                      <input
                        type="number"
                        id={`opportunityRating${index + 1}`}
                        name={`opportunityRating${index + 1}`}
                        value={opportunity.rating}
                        onChange={(e) => handleChange(index, 'rating', e.target.value, true)}
                        min="1"
                        max="4"
                        placeholder="Enter rating (1-4)"
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                ))}
              </div> 
              
              </div>
              <div className='flex flex-col items-center'>
                <h2 className="text-xl font-bold mb-4 ">Threats</h2>
                <label htmlFor="numThreats" className="block mb-2">Number of Threats:</label>
                <input
                  type="number"
                  id="numThreats"
                  name="numThreats"
                  value={numThreats}
                  onChange={(e) => setNumThreats(e.target.value)}
                  placeholder="Enter number of threats"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                />

                {displayThreatParams && threatsData.map((threat, index) => (
                  <div key={index} className="flex gap-3">
                    <div>
                      <label htmlFor={`threat${index + 1}`} className="block mb-2">Threat {index + 1}:</label>
                      <input
                        type="text"
                        id={`threat${index + 1}`}
                        name={`threat${index + 1}`}
                        value={threat.threat}
                        onChange={(e) => handleChange(index, 'threat', e.target.value, false)}
                        placeholder={`Enter threat ${index + 1}`}
                        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor={`threatWeight${index + 1}`} className="block mb-2">Weight:</label>
                      <input
                        type="number"
                        id={`threatWeight${index + 1}`}
                        name={`threatWeight${index + 1}`}
                        value={threat.weight}
                        onChange={(e) => handleChange(index, 'weight', e.target.value, false)}
                        step="0.01"
                        min="0"
                        max="1"
                        placeholder="Enter weight (0-1)"
                        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor={`threatRating${index + 1}`} className="block mb-2">Rating:</label>
                      <input
                        type="number"
                        id={`threatRating${index + 1}`}
                        name={`threatRating${index + 1}`}
                        value={threat.rating}
                        onChange={(e) => handleChange(index, 'rating', e.target.value, false)}
                        min="1"
                        max="4"
                        placeholder="Enter rating (1-4)"
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                ))}
            </div>
            
            <button
              type="button"
              onClick={displayParams ? handleSubmit : () => {
                handleDisplayParams();
                handleThreatDisplayParams();
              }}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {displayParams ? 'Submit' : 'Display Parameters'}
            </button>
          </form>
        </div>

        {(showTable || showThreatTable) && (
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
                    <td className="px-6 py-4 whitespace-nowrap">Opportunity</td>
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.opportunity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.weight}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.rating}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.score}</td>
                  </tr>
                ))}
                {threatTableData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">Threat</td>
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.threat}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.weight}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.rating}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.score}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100">
                  <td colSpan="5" className="px-6 py-4 text-right font-bold">Total Score</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold">
                    {tableData.reduce((total, item) => total + item.score, 0) + threatTableData.reduce((total, item) => total + item.score, 0)}
                  </td>
                </tr> 
              </tbody>
            </table>
            <div className="mt-4 flex justify-center">
              <Link to="/csf-page" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Go to csf Page
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OppandThreat;

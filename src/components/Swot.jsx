import React, { useState, useEffect } from 'react';
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { useEarthoOne } from '@eartho/one-client-react';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';
import CSF from './CSF';
import BCG from './BCG';
import IE from './IE';
import Space from './Space';
import Grand from './Grand';

const Swot = () => {
  const [strengthsData, setStrengthsData] = useState([{ strength: '', weight: '', rating: '' }]);
  const [weaknessesData, setWeaknessesData] = useState([{ weakness: '', weight: '', rating: '' }]);
  const [opportunitiesData, setOpportunitiesData] = useState([{ opportunity: '', weight: '', rating: '' }]);
  const [threatsData, setThreatsData] = useState([{ threat: '', weight: '', rating: '' }]);
  const [totalIFE, setTotalIFE] = useState(0);
  const [totalEFE, setTotalEFE] = useState(0);
  const db = getFirestore();
  const { user } = useEarthoOne();
  const navigate = useNavigate();


  useEffect(() => {
    calculateTotals();
  }, [strengthsData, weaknessesData, opportunitiesData, threatsData]);

  const handleChange = (index, field, value, category) => {
    const newData = category === 'strengths' ? [...strengthsData] : category === 'weaknesses' ? [...weaknessesData] : category === 'opportunities' ? [...opportunitiesData] : [...threatsData];
    newData[index][field] = value;
    category === 'strengths' ? setStrengthsData(newData) : category === 'weaknesses' ? setWeaknessesData(newData) : category === 'opportunities' ? setOpportunitiesData(newData) : setThreatsData(newData);
  };


  const handleAddField = (category) => {
    const newData = category === 'strengths' ? [...strengthsData, { strength: '', weight: '', rating: '' }] : category === 'weaknesses' ? [...weaknessesData, { weakness: '', weight: '', rating: '' }] : category === 'opportunities' ? [...opportunitiesData, { opportunity: '', weight: '', rating: '' }] : [...threatsData, { threat: '', weight: '', rating: '' }];
    category === 'strengths' ? setStrengthsData(newData) : category === 'weaknesses' ? setWeaknessesData(newData) : category === 'opportunities' ? setOpportunitiesData(newData) : setThreatsData(newData);
  };

  const handleRemoveField = (index, category) => {
    const newData = category === 'strengths' ? [...strengthsData] : category === 'weaknesses' ? [...weaknessesData] : category === 'opportunities' ? [...opportunitiesData] : [...threatsData];
    newData.splice(index, 1);
    category === 'strengths' ? setStrengthsData(newData) : category === 'weaknesses' ? setWeaknessesData(newData) : category === 'opportunities' ? setOpportunitiesData(newData) : setThreatsData(newData);
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

      await Promise.all([...strengthBatch, ...weaknessBatch, ...opportunityBatch, ...threatBatch]);
      alert("Data saved to Firestore");

      calculateTotals();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const calculateScore = (data) => {
    const calculatedData = data.map(item => ({
      ...item,
      score: (parseFloat(item.weight) || 0) * (parseInt(item.rating) || 0) 
    }));
    const totalScore = calculatedData.reduce((total, item) => total + item.score, 0);
    return totalScore;
  };

  const calculateTotals = () => {
    const totalStrengthScore = calculateScore(strengthsData);
    const totalWeaknessScore = calculateScore(weaknessesData);
    const totalOpportunityScore = calculateScore(opportunitiesData);
    const totalThreatScore = calculateScore(threatsData);
  
    const totalIFEWeight = totalStrengthScore + totalWeaknessScore; 
    const totalEFEWeight = totalOpportunityScore + totalThreatScore; 
  
    setTotalIFE(totalIFEWeight);
    setTotalEFE(totalEFEWeight);
  };

  const calculateIFEWeight = () => {
    const totalStrengthWeight = strengthsData.reduce((total, item) => total + (parseFloat(item.weight) || 0), 0);
    const totalWeaknessWeight = weaknessesData.reduce((total, item) => total + (parseFloat(item.weight) || 0), 0);
    const totalWeight = totalStrengthWeight + totalWeaknessWeight;
    return isNaN(totalWeight) ? '0.00' : totalWeight.toFixed(2);
  };
  
  const calculateEFEWeight = () => {
    const totalOpportunityWeight = opportunitiesData.reduce((total, item) => total + (parseFloat(item.weight) || 0), 0);
    const totalThreatWeight = threatsData.reduce((total, item) => total + (parseFloat(item.weight) || 0), 0);
    const totalWeight = totalOpportunityWeight + totalThreatWeight;
    return isNaN(totalWeight) ? '0.00' : totalWeight.toFixed(2);
  };

  const isIFEWeightValid = calculateIFEWeight() >= 0 && calculateIFEWeight() <= 1;

  


  return (
    <div className='bg-slate-700 min-h-screen'>
      <div className='py-4'>
        <Navbar />
      </div>
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold text-white mb-8">SWOT Analysis</h1>
        <form className="max-w-[80vw] w-full bg-white p-8 border border-gray-300 rounded-lg" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Strengths</h2>
              {strengthsData.map((strength, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={strength.strength}
                    onChange={(e) => handleChange(index, 'strength', e.target.value, 'strengths')}
                    placeholder={`Enter strength ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  />
                  <input
                    type="number"
                    value={strength.weight}
                    onChange={(e) => handleChange(index, 'weight', e.target.value, 'strengths')}
                    placeholder={`Weight ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  />
                  <select
                    value={strength.rating}
                    onChange={(e) => handleChange(index, 'rating', e.target.value, 'strengths')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  >
                    <option value="">Select Rating</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                 
                  <button
                    type="button"
                    onClick={() => handleAddField('strengths')}
                    className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                  >
                    +
                  </button>
                  {strengthsData.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField(index, 'strengths')}
                      className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 ml-2"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
            </div>


            <div>
              <h2 className="text-xl font-bold mb-4">Weaknesses</h2>
              {weaknessesData.map((weakness, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={weakness.weakness}
                    onChange={(e) => handleChange(index, 'weakness', e.target.value, 'weaknesses')}
                    placeholder={`Enter weakness ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  />
                  <input
                    type="number"
                    value={weakness.weight}
                    onChange={(e) => handleChange(index, 'weight', e.target.value, 'weaknesses')}
                    placeholder={`Weight ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  />
                 
                  <select
                    value={weakness.rating}
                    onChange={(e) => handleChange(index, 'rating', e.target.value, 'weaknesses')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  >
                    <option value="">Select Rating</option>
                    <option value="3">1</option>
                    <option value="4">2</option>
                  </select>


                  <button
                    type="button"
                    onClick={() => handleAddField('weaknesses')}
                    className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                  >
                    +
                  </button>
                  {weaknessesData.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField(index, 'weaknesses')}
                      className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 ml-2"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
            </div>


            <div>
        <h2 className="text-xl font-bold mb-4">Opportunities</h2>
        {opportunitiesData.map((opportunity, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={opportunity.opportunity}
              onChange={(e) => handleChange(index, 'opportunity', e.target.value, 'opportunities')}
              placeholder={`Enter opportunity ${index + 1}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
            />
            <input
              type="number"
              value={opportunity.weight}
              onChange={(e) => handleChange(index, 'weight', e.target.value, 'opportunities')}
              placeholder={`Weight ${index + 1}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
            />
            <select
              value={opportunity.rating}
              onChange={(e) => handleChange(index, 'rating', e.target.value, 'opportunities')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
            >
              <option value="">Select Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <button
              type="button"
              onClick={() => handleAddField('opportunities')}
              className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              +
            </button>
            {opportunitiesData.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveField(index, 'opportunities')}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 ml-2"
              >
                -
              </button>
            )}
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Threats</h2>
        {threatsData.map((threat, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={threat.threat}
              onChange={(e) => handleChange(index, 'threat', e.target.value, 'threats')}
              placeholder={`Enter threat ${index + 1}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
            />
            <input
              type="number"
              value={threat.weight}
              onChange={(e) => handleChange(index, 'weight', e.target.value, 'threats')}
              placeholder={`Weight ${index + 1}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
            />
            <select
              value={threat.rating}
              onChange={(e) => handleChange(index, 'rating', e.target.value, 'threats')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
            >
              <option value="">Select Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <button
              type="button"
              onClick={() => handleAddField('threats')}
              className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              +
            </button>
            {threatsData.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveField(index, 'threats')}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 ml-2"
              >
                -
              </button>
            )}
          </div>
        ))}
      </div>
          </div>

          <div className="flex justify-between w-full px-8 mt-8">
            <div className="total-score-card bg-white rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Total IFE Weight</h2>
              <p className="text-2xl font-semibold text-green-500">{calculateIFEWeight()}</p>
            </div>
            <div className="total-score-card bg-white rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Total IFE Score</h2>
              <p className="text-2xl font-semibold text-green-500">{totalIFE.toFixed(2)}</p>
            </div>
            <div className="total-score-card bg-white rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Total EFE Weight</h2>
              <p className="text-2xl font-semibold text-green-500">{calculateEFEWeight()}</p>
            </div>
            <div className="total-score-card bg-white rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Total EFE Score</h2>
              <p className="text-2xl font-semibold text-green-500">{totalEFE.toFixed(2)}</p>
            </div>
          </div>

          {!isIFEWeightValid && (
            <div className="text-red-500 text-sm mb-4">IFE Weight should be between 0 and 1</div>
          )}

          <button
            type="submit"
            className="w-full mt-8 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </form>


      </div>
      <CSF />
      <BCG />
      <IE />
      <Space />
      <Grand />
    </div>
  );
};


export default Swot;

import React, { useState } from 'react';
import { getFirestore, addDoc, collection } from "firebase/firestore"; 
import { useEarthoOne } from '@eartho/one-client-react';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';
import CSF from './CSF';
import BCG from './BCG';

const Swot = () => {
  const [strengthsData, setStrengthsData] = useState([{ strength: '', weight: '', rating: '' }]);
  const [weaknessesData, setWeaknessesData] = useState([{ weakness: '', weight: '', rating: '' }]);
  const [opportunitiesData, setOpportunitiesData] = useState([{ opportunity: '', weight: '', rating: '' }]);
  const [threatsData, setThreatsData] = useState([{ threat: '', weight: '', rating: '' }]);
  const [totalScore, setTotalScore] = useState(0); 
  const db = getFirestore();
  const { user } = useEarthoOne();
  const navigate = useNavigate();

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

      const totalOpportunityScore = calculateScore(opportunitiesData);
      const totalThreatScore = calculateScore(threatsData);
      const totalStrengthScore = calculateScore(strengthsData);
      const totalWeaknessScore = calculateScore(weaknessesData);
      const totalSum = totalOpportunityScore + totalThreatScore + totalStrengthScore + totalWeaknessScore;

      setTotalScore(totalSum);
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
                  <input
                    type="number"
                    value={strength.rating}
                    onChange={(e) => handleChange(index, 'rating', e.target.value, 'strengths')}
                    placeholder={`Rating ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  />
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
                  <input
                    type="number"
                    value={weakness.rating}
                    onChange={(e) => handleChange(index, 'rating', e.target.value, 'weaknesses')}
                    placeholder={`Rating ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  />
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
                  <input
                    type="number"
                    value={opportunity.rating}
                    onChange={(e) => handleChange(index, 'rating', e.target.value, 'opportunities')}
                    placeholder={`Rating ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  />
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
                  <input
                    type="number"
                    value={threat.rating}
                    onChange={(e) => handleChange(index, 'rating', e.target.value, 'threats')}
                    placeholder={`Rating ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"
                  />
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
          <button
            type="submit"
            className="w-full mt-8 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </form>

      </div>
      <BCG />
      <CSF />
    </div>
  );
};

export default Swot;

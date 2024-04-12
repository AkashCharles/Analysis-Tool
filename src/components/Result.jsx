import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const Result = ({ userDisplayName }) => {
  const [strengthsData, setStrengthsData] = useState([]);
  const [weaknessesData, setWeaknessesData] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const strengthsSnapshot = await getDocs(collection(db, "strengths"));
        const weaknessesSnapshot = await getDocs(collection(db, "weaknesses"));

        const strengthsData = strengthsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(item => item.displayName === userDisplayName && item.strength !== '' && item.weight !== '' && item.rating !== '');

        const weaknessesData = weaknessesSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(item => item.displayName === userDisplayName && item.weakness !== '' && item.weight !== '' && item.rating !== '');

        setStrengthsData(strengthsData);
        setWeaknessesData(weaknessesData);
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchDataFromFirestore();
  }, [db, userDisplayName]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
      <h1 className="text-3xl font-bold text-center mb-8">Results</h1>

      {strengthsData.length > 0 && (
        <div className="mt-8 mx-auto">
          <h2 className="text-xl font-bold mb-4">Strengths Data</h2>
          <table className="min-w-full divide-y divide-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strength</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {strengthsData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{item.strength}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.weight}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {weaknessesData.length > 0 && (
        <div className="mt-8 mx-auto">
          <h2 className="text-xl font-bold mb-4">Weaknesses Data</h2>
          <table className="min-w-full divide-y divide-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weakness</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {weaknessesData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{item.weakness}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.weight}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Result;

import React, { useState } from 'react';

const Weakness = () => {
  const [numWeaknesses, setNumWeaknesses] = useState('');
  const [displayParams, setDisplayParams] = useState(false);

  const handleDisplayParams = () => {
    const num = parseInt(numWeaknesses);
    if (!isNaN(num)) {
      setDisplayParams(true);
    } else {
      alert('Please enter a valid number for Number of Weaknesses.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Assuming you have a route to navigate to "opportunities" page
    window.location.href = "opportunities.html";
  };

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        <form id="weaknessesForm">
          <div className="formbold-mb-3">
            <label htmlFor="numWeaknesses" className="formbold-form-label">Number of Weaknesses:</label>
            <input
              type="number"
              name="numWeaknesses"
              id="numWeaknesses"
              value={numWeaknesses}
              onChange={(e) => setNumWeaknesses(e.target.value)}
              placeholder="Enter number of weaknesses"
              className="formbold-form-input"
            />
          </div>
          <div className="weaknesses-container formbold-mb-3">
            {/* Weaknesses will be dynamically generated here */}
            {displayParams && Array.from({ length: parseInt(numWeaknesses) }, (_, i) => (
              <div className="formbold-mb-3" key={i}>
                <label className="formbold-form-label">Weakness {i + 1}:</label>
                <input type="text" className="formbold-form-input" name={`weakness${i + 1}`} placeholder={`Enter weakness ${i + 1}`} />
                <div className="formbold-mb-3">
                  <label className="formbold-form-label">Weight:</label>
                  <input type="number" className="formbold-form-input weight" name={`weaknessWeight${i + 1}`} step="0.01" min="0" max="1" placeholder="Enter weight (0-1)" />
                </div>
                <div className="formbold-mb-3">
                  <label className="formbold-form-label">Rating:</label>
                  <input type="number" className="formbold-form-input rating" name={`weaknessRating${i + 1}`} min="1" max="4" placeholder="Enter rating (1-4)" />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={displayParams ? handleSubmit : handleDisplayParams}
            className="formbold-btn"
          >
            {displayParams ? 'Next' : 'Display Parameters'}
          </button>
          <button
            id="backBtn"
            className="formbold-btn"
            style={{ display: 'none' }}
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default Weakness;

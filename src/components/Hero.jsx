import React from 'react';
import "../styles/Navbar.css"

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <p className="heading-text">
          <strong>Explore our robust Company Analysis Tool</strong> for strategic planning and informed decision-making.
        </p>
        <p className='secondary-text'>Evaluate your business's performance and position in the market for sustainable growth.</p>
      </div>
      <div className='button-spacing'>
        <button>Start</button>
        <button>About</button>
      </div>
    </div>
  );
}

export default Hero;

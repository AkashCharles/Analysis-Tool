import React from 'react';
import "../styles/Navbar.css"
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const Hero = () => {

  const navigate = useNavigate(); 

  const handleStartButtonClick = () => {
    navigate('/strength-page');
  };

  const handleLearnButtonClick = () => {
    navigate('/Learn-page');
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <p className="heading-text">
          <strong>Explore our robust Company Analysis Tool</strong> for strategic planning and informed decision-making.
        </p>
        <p className='secondary-text'>Evaluate your business's performance and position in the market for sustainable growth.</p>
      </div>
      <div className='button-spacing'>
        <div>
          <button onClick={handleStartButtonClick} className='start-button'>Start Free</button>
        </div>
        <div className='learn-more'>
          <p onClick={handleLearnButtonClick} class="learn-more">Learn More </p> <FaArrowRightLong class="arrow" size={20}/>
        </div>
      </div>
    </div>
  );
}

export default Hero;

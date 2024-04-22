import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/Navbar.css'
import Hero from '../components/Hero';

function Home() {
  return (
    <div className="image">
      <div className='image'></div> 
      <div className='py-4'>
        <Navbar />
      </div>
      <Hero />
    </div>
  );
}

export default Home;

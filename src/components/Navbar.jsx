import React from 'react';
import "../styles/Navbar.css"
import Login from './Login';

const Navbar = () => {
  return (
    <div className='Navbar'>
        <div className='navbarcontents'>
            <div>
                <p className="texts">image</p>
            </div>
            <div>
                <p className="texts">Header</p>
            </div>
            <div className='login'>
                <Login></Login>
            </div>
        </div>
    </div>
  );
}

export default Navbar;

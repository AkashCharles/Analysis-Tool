import React from 'react';
import "../styles/Navbar.css"
import Login from './Login';

const Navbar = () => {
  return (
    <div className='Navbar fixed w-screen '>
        <div className='navbarcontents text-white'>
            <div className='flex justify-between gap-5'>
                <p>image</p>
                <p>Nelsonin</p>
            </div>
            <div className=' flex justify-between w-[30%] '>
                <div>
                    <a href="">Home</a>
                </div>
                <div>
                    <a href="">Start</a>
                </div>
                <div>
                    <a href="">About</a>
                </div>
            </div>
            <div className=''>
                <Login></Login>
            </div>
        </div>
    </div>
  );
}

export default Navbar;

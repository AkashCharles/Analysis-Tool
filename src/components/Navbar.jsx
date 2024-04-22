import React from 'react';
import "../styles/Navbar.css"
import Login from './Login';

const Navbar = () => {
  return (
    <div className='Navbar flex justify-between items-center mx-52'>
        <div className='navbarcontents text-white flex justify-between w-full'>
            <div className='flex items-center gap-5'>
                <p>image</p>
                <p>Nelsonin</p>
            </div>
            <div className=' flex items-center gap-14 w-[30%]'>
                <div>
                    <a href="" className="button-cylinder">Home</a>
                </div>
                <div>
                    <a href="" className="button-cylinder">Start</a>
                </div>
                <div>
                    <a href="" className="button-cylinder">About</a>
                </div>
            </div>
            <div className='flex items-center'>
                <Login></Login>
            </div>
        </div>
    </div>
  );
}

export default Navbar;

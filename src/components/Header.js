import React from 'react';
import { Link } from 'react-scroll';


const Header = () => {
  return (
    <header className='py-8'>
      <div className='container mx-auto'>
        <div className='flex justify-between items-center'>
          <a className='text-gray font-bold text-2xl w-40 tracking-wide leading-6'  href="#">
            MARIO NASSAR
          </a>
          <Link to='contact'>
            <button className='btn btn-sm'>Work with me</button>
          </Link>  
        </div>
      </div>

    </header>
  )
};

export default Header;

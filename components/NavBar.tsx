import React from 'react'
import DateComponent from './DateComponent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGear } from '@fortawesome/free-solid-svg-icons/faUserGear'
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { NavBarProps } from '@/types/NavBarProps';

const NavBar = ({
  iconHouse = true,
  iconProfile = true,
  selectedDate,
  setSelectedDate,
}: NavBarProps) => {
  return (
    <div className='w-full h-20 min-h-[80px] flex flex-row items-center justify-between px-8 bg-[#1a1a1a] border-b border-gray-800'>
      <div className='flex items-center'>
        {iconHouse && (
          <a href='/' className='flex items-center justify-center w-10 h-10 hover:bg-gray-800 rounded-lg transition-colors'>
            <FontAwesomeIcon size='lg' color='white' icon={faHouse} />
          </a>
        )}

        {!iconHouse && iconTable && (
          <a href='/table' className='flex items-center justify-center w-10 h-10 hover:bg-gray-800 rounded-lg transition-colors'>
            <FontAwesomeIcon size='lg' color='white' icon={faTable} />
          </a>
        )}
      </div>

      <div className='flex justify-center flex-grow'>
        <DateComponent selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>

      {iconProfile && (
        <div className='flex items-center'>
          <div className='relative'>
            <button 
              onClick={toggleDropdown}
              className='flex items-center justify-center w-10 h-10 hover:bg-gray-800 rounded-lg transition-colors'
            >
              <FontAwesomeIcon size='lg' color='white' icon={faUserGear} />
            </button>

            {showDropdown && (
              <div className='absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg z-50'>
                <div className='absolute -top-1 right-4 w-2 h-2 bg-white rotate-45 shadow-md'></div>
                <a href='/profile' className='block px-4 py-2 hover:bg-gray-200 hover:rounded-t-lg transition-colors'>Profile</a>
                <a href='/settings' className='block px-4 py-2 hover:bg-gray-200 transition-colors'>Settings</a>
                <a href='/logout' className='block px-4 py-2 hover:bg-gray-200 hover:rounded-b-lg transition-colors'>Logout</a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NavBar
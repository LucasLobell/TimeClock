"use client";

import React, { useState } from 'react'
import DateComponent from './DateComponent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGear } from '@fortawesome/free-solid-svg-icons/faUserGear'
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse'
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable'
import { NavBarProps } from '@/types/NavBarProps'

const NavBar = ({
  iconHouse = true,
  iconProfile = true,
  iconTable = false,
  selectedDate,
  setSelectedDate,
}: NavBarProps) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev)
  }

  return (
    <div className='w-full flex flex-row items-start relative h-fit'>
      {iconHouse && (
        <a href='/' className='absolute left-[50px] top-[50px]'>
          <FontAwesomeIcon size='xl' color='white' icon={faHouse} />
        </a>
      )}

      {!iconHouse && iconTable && (
        <a href='/table' className='absolute left-[50px] top-[50px]'>
          <FontAwesomeIcon size='xl' color='white' icon={faTable} />
        </a>
      )}

      <div className='flex justify-center flex-grow'>
        <DateComponent selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>

      {iconProfile && (
        <div className='absolute right-[50px] top-[50px]'>
  <div className='relative'>
    <button onClick={toggleDropdown}>
      <FontAwesomeIcon size='xl' color='white' icon={faUserGear} />
    </button>

    {showDropdown && (
      <div className='absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg'>
        <div className='absolute -top-1 right-4 w-2 h-2 bg-white rotate-45 shadow-md z-[-2]'></div>
        <a href='/profile' className='block px-4 py-2 hover:bg-gray-200 hover:rounded-t'>Profile</a>
        <a href='/settings' className='block px-4 py-2 hover:bg-gray-200'>Settings</a>
        <a href='/logout' className='block px-4 py-2 hover:bg-gray-200 hover:rounded-b'>Logout</a>
      </div>
    )}
  </div>
</div>
      )}
    </div>
  )
}

export default NavBar

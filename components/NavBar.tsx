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
    <div className='w-full flex flex-row items-start h-fill'>
        {iconHouse && (
          <a href='/' className='ml-[50px] mt-[50px]'>
              <FontAwesomeIcon  size="xl" color='white' icon={faHouse} />
          </a>
        )}
          <div className={`flex flex-grow justify-center ${!iconHouse && 'ml-10'} ${!iconProfile && 'mr-10'}`}>
              <DateComponent selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </div>
        {iconProfile && (
          <a href='/profile' className='mr-[50px] mt-[50px]'>
              <FontAwesomeIcon size='xl' color='white' icon={faUserGear} />
          </a>
        )}
    </div>
  )
}

export default NavBar
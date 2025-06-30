'use client'

import { useEffect, useState } from 'react'
import { account } from '@/app/appwrite'
import NavBar from '@/components/NavBar'
import React from 'react'

const page = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    account.get().then(user => {
      setUserId(user.$id);
      setSelectedDate(new Date());
      setLoggedInUser(user);
    });
  }, []);

  return (
    <div className='h-screen w-screen flex flex-col relative'>
  <NavBar
    iconHouse={true}
    iconProfile={true}
    selectedDate={selectedDate}
    setSelectedDate={setSelectedDate}
  />

  <div className='flex-1 flex flex-col items-center justify-center'>
    <h1 className='text-2xl font-bold'>Profile</h1>
    <p className='text-gray-600'>User ID: {userId}</p>
    <p className='text-gray-600'>Name: {loggedInUser?.name}</p>
    <p className='text-gray-600'>Email: {loggedInUser?.email}</p>
    <p className='text-gray-600'>Selected Date: {selectedDate?.toLocaleDateString()}</p>
  </div>
</div>

  )
}

export default page
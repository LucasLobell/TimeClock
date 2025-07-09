'use client'

import { useEffect, useState } from 'react'
import { account } from '@/app/appwrite'
import NavBar from '@/components/NavBar'
import Loading from '@/components/Loading'
import React from 'react'

const page = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account.get().then(user => {
      setUserId(user.$id);
      setSelectedDate(new Date());
      setLoggedInUser(user);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <div className="w-full h-20 min-h-[80px] flex flex-row items-center justify-between px-8 bg-[#1a1a1a] border-b border-gray-800">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg animate-pulse">
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
            </div>
          </div>
          <div className="flex justify-center flex-grow">
            <div className="w-[348px] h-12 bg-gray-800 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg animate-pulse">
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 pt-8 px-8 pb-4">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen w-screen flex flex-col overflow-hidden'>
      <NavBar
        iconHouse={true}
        iconProfile={true}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <div className='flex-1 flex flex-col items-center justify-center p-4'>
        <h1 className='text-2xl font-bold text-white mb-4'>Profile</h1>
        <div className='bg-gray-800 rounded-lg p-6 space-y-3'>
          <p className='text-gray-300'>User ID: <span className='text-white'>{userId}</span></p>
          <p className='text-gray-300'>Name: <span className='text-white'>{loggedInUser?.name}</span></p>
          <p className='text-gray-300'>Email: <span className='text-white'>{loggedInUser?.email}</span></p>
          <p className='text-gray-300'>Selected Date: <span className='text-white'>{selectedDate?.toLocaleDateString()}</span></p>
        </div>
      </div>
    </div>
  )
}

export default page
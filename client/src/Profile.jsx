import React from 'react'
import Navbar from './components/Navbar'

function Profile() {
  return (
    <div>
      <div className='flex items-center flex-col bg-slate-100 p-2'>
        <div className=''>Avatar</div>
        <div>Username</div>
      </div>
      
      <div className='bg-slate-200 p-4 border m-6'>
        <h1 className='font-bold'>About</h1>
        <div>Works at</div>
        <div>Studied at</div>
        <div>Lives at</div>
        <div>Member since</div>
        </div>
        <div className='bg-slate-200 p-4 border m-6'>
          <h1 className='font-bold'>Posts</h1>
        </div>
    </div>
  )
}

export default Profile
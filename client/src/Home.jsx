import React from 'react'
import { useEffect, useState, useContext} from 'react'
import AuthContext from './contexts/Contexts'
import Feed from './components/Feed'
import Sidebar from './components/Sidebar'

function Page() {

  return (
    <div>
      <div className='flex p-4 bg-slate-200 '>
        <Sidebar />
        <Feed />
      </div>
    </div>
  )
}

export default Page
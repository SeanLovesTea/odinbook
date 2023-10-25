
import { useState, useEffect } from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

function Header({imageURL, username, logout}) {

  const [dropIsOpen, setDropIsOpen] = useState(false)

  return (
    <div className='bg-slate-400 flex justify-centre rounded-md'>
        <div className='p-2 before:cursor-pointer rounded-md mx-4 w-16 hover:bg-slate-300'>
          <Link to={"/"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="true" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span className='text-sm'>Home</span>
          </Link>
        </div>

        <div className='p-2 cursor-pointer rounded-md mx-4 w-16 hover:bg-slate-300'>
          <Link to={"/friends"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="true" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <span className='text-sm'>Friends</span>
          </Link>
        </div>
        
        <div
        onClick={() => setDropIsOpen(!dropIsOpen)} 
        className='p-2 mr-4 w-16 text-center ml-auto relative cursor-pointer hover:bg-slate-300 rounded-md'>
          <div>
            <div ><Avatar imageURL={imageURL}/></div>
            <div className='text-sm absolute bottom-2 right-3'>Me &#11015;</div>
          </div>

          {dropIsOpen && 
          <div className='dropdown'>
          <div className='absolute overflow-auto bg-white top-20 right-0 z-10 rounded-md border border-slate-400'>
                <div className='p-4  hover:bg-slate-200 mr-0 ml-auto border border-slate-200'>
                  <Link to={"/profile"}>Profile</Link>
                </div>
                <div>
                <div 
                  onClick={logout}
                  className='p-4 hover:bg-slate-200 mr-0 ml-auto'>
                    Logout
                </div>
                </div>
            </div>
            </div>}
        </div>
        
    </div>
  )
}

export default Header
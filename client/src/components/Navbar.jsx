import {useContext} from 'react'
import AuthContext from '../contexts/Contexts'
import Logout from './Logout'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

function Header() {
  const {currentUser, setCurrentUser, id, setId} = useContext(AuthContext)
  return (
    <div className='bg-blue-300 p-2 flex justify-centre'>
        <div className='w-12 text-center'>
          <div ><Avatar imageURL={currentUser.image}/></div>
          <div>{currentUser.username}</div>
        </div>
        <div>
          <Link to={"/"} className='p-2 cursor-pointer bg-gray-500 rounded-md mx-4'>Home</Link>
        </div>
        <div>
          <Link to={"/profile"} className='p-2 cursor-pointer bg-gray-500 rounded-md mx-4'>Profile</Link>
        </div>
        <div>
          <Link to={"/friends"} className='p-2 cursor-pointer bg-gray-500 rounded-md mx-4'>Friends</Link>
        </div>
        <Logout />
    </div>
  )
}

export default Header
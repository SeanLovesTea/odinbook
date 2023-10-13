import { useState, useEffect, useContext } from 'react'
import AuthContext from '../contexts/Contexts'

function Sidebar() {
  const {id, selectedUser, setSelectedUser} = useContext(AuthContext)
  const [allUsers, setAllUsers] = useState()
  const [friends, setAllFriends] = useState()

  useEffect(() =>{
    getUsers()
    getFriends()
  },[])

  async function getUsers() {
    try {
      const response = await fetch('http://localhost:4000/users', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      removeSelfFromAllUsers(data)

    } catch (error) {
      console.log(error)
    }
  }

  function removeSelfFromAllUsers(allUsers) {
    const filteredArray = allUsers.filter((item) => item._id !== id)
    setAllUsers(filteredArray)
  }

  async function getFriends() {

    try {
      const response = await fetch(`http://localhost:4000/friends/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      setAllFriends(data)

    } catch (error) {
      console.log(error)
    }
  }
  async function addFriend(e, recipient) {
    e.preventDefault()
    const requester = id
    const data = { 
      requester,
      recipient
     }
     console.log(data)
    try {
      const response = await fetch('http://localhost:4000/friends/add', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      getFriends()
    } catch (error) {
        console.error(error)
    }
  }
  async function removeFriend() {
    console.log('remove friend click')
  }
  return (
    <div className='width-100px'>
      <ul>
        <li className='p-2 mx-2 border-b-2 font-bold text-gray-900 bg-gray-100'>Friends</li>
        {friends ? friends.map(user => (
          <li 
            key={user._id}
            className={ `p-2 mx-2 cursor-pointer hover:bg-gray-200 border-b-2 ${selectedUser === user._id ? (' bg-green-200') : ''}`}
            onClick={() => setSelectedUser(user._id)}
            >{user.username}
          </li>
        )) : <div></div>}
      </ul>
      <ul>
        <li className='p-2 mx-2 border-b-2 font-bold  text-gray-900 bg-gray-100'>All Users</li>
        {allUsers ? allUsers.map(user => (
          <li 
          key={user._id}
          className={` flex p-2 mx-2 cursor-pointer hover-bg-gray-100 border-b-2 ${selectedUser === user._id ? (' bg-blue-200') : ''}`}
          onClick={() => setSelectedUser(user._id)}
        >
          {user.username}
          {friends?.some((friend) => friend._id === user._id) ? (
            <div className='flex ml-auto'>
              <div className="bg-blue-200 text-xs text-center p-1 ml-auto">Already a Friend</div>
              <div 
              onClick={removeFriend}
              className='bg-red-300 text-xs text-center'>Remove Friend</div>
            </div>
            
          ) : (
            <div 
              className='bg-green-200 cursor-pointer ml-auto border text-xs text-center p-1 hover-bg-green-400'
              onClick={(e) => addFriend(e, user._id)}
            >
              Add Friend
            </div>
          )}
        </li>
        )) : <div></div>}
      </ul>
    </div>
  )
}

export default Sidebar

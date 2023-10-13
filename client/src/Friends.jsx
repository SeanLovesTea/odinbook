import {useState, useEffect, useContext} from 'react'
import NavBar from './components/Navbar'
import AuthContext from './contexts/Contexts'

function Friends() {
  const {id} = useContext(AuthContext)
  const [selectedTab, setSelectedTab] = useState('find')
  const [allUsers, setAllUsers] = useState([])
  const [friends, setAllFriends] = useState([])
  const [allUsersMinusFriends, setAllUsersMinusFriends] = useState([])
  const [notifications, setNotifications]= useState([])

  useEffect(() =>{ 
    getAllData()
  },[])

  function getAllData() {
    getUsers()
    getFriends()
    getCurrentUserNotifications()
  }
  useEffect(() =>{
    allUsersWithoutFriends()
  },[allUsers, friends])

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

  async function getCurrentUserNotifications() {
    try {
      const response = await fetch(`http://localhost:4000/friends/status/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers:  {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      console.log("getusernoti : ", data)
      removeFriendStatusFromNotifications(data.currentUser.friends)
      
    } catch (error) {
      console.log(error)
    }
  }
  
  function removeFriendStatusFromNotifications(data) {
    const filteredArray = data.filter(n => n.status !== 'friend')
    setNotifications(filteredArray)
  }

  async function addFriend(recipient, action) {
    // e.preventDefault()
    const requester = id
    const data = { 
      requester,
      recipient,
      action
     }
    console.log("payload in addfriends : ", data)
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
      getAllData()

    } catch (error) {
        console.error(error)
    }
  }
  function allUsersWithoutFriends() {
    const filteredArray = allUsers.filter(user1 => !friends.some(user2 => user2._id === user1._id))
    setAllUsersMinusFriends(filteredArray)
  }
  async function removeFriend(friendId) {
    const data = {
      friendId,
      userId: id
    }
    try {
      const response = await fetch('http://localhost:4000/friends/remove', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      } catch(error) {
        console.log(error)
      }
      getAllData()
  }
  return (
    <div className='flex h-full'>
      <div className='bg-blue-100 h-screen w-2/5 p-2'>
        <h1 className='font-bold text-2xl'>Friends</h1>
        <div onClick={() => setSelectedTab('find')} className={`p-2 cursor-pointer hover:bg-blue-200 rounded-md ${selectedTab == 'find' ? 'bg-blue-200' : ''}`}>Find Friends</div>
        <div onClick={() => setSelectedTab('req')} className={`p-2 cursor-pointer hover:bg-blue-200 rounded-md ${selectedTab == 'req' ? 'bg-blue-200' : ''}`}>Friend Requests <span className='text-blue-600'>{notifications.length}</span></div>
        <div onClick={() => setSelectedTab('all')} className={`p-2 cursor-pointer hover:bg-blue-200 rounded-md ${selectedTab == 'all' ? 'bg-blue-200' : ''}`}>All Friends</div>
        </div>

      <div className='bg-blue-50 w-full p-2'>
      <h1 className='text-xl font-bold'>{selectedTab == 'find' ? 'Find Friends' : selectedTab == 'req' ? 'Friend Requests' : 'All Friends'}</h1>
        {/*find friends*/}
        { selectedTab == 'find' && (
          (allUsers.length > 0 && allUsersMinusFriends.length > 0 ? 
            <div>
            {allUsersMinusFriends.map(user => (
              <div 
                className='bg-white flex p-2 my-2' 
                key={user._id}>
              <div className=' p-2 my-2'>Avatar</div>
              <div className=' p-2 my-2'>{user.username}</div>
              <div 
                className='p-2 my-2 bg-green-200 rounded-md cursor-pointer'
                onClick={() => addFriend(user._id, 'add')} 
                >Add Friend</div>
              </div> 
            ))}
            </div>
          :
            <div>No Users</div>
          )
        )}
        {/*friends requests*/ console.log(notifications)}
        { selectedTab == 'req' && (
          (notifications.length > 0 && notifications ? 
            <div>
              {notifications.map(n =>(
                <div 
                className='p-2 my-2 bg-white flex'
                key={n._id}>
                  <div className='mr-4'>Avatar</div>
                  <div className='mx-4'>{n.user.username}</div>
                  <div className='flex mr-0 ml-auto'>
                    <div className='mx-4'>{n.status}</div>
                    <div 
                      className='bg-red-200 p-2 cursor-pointer mx-2'
                      onClick={() => removeFriend(n.user._id)}
                      >-
                    </div>
                    <div 
                      className='bg-green-200 p-2 cursor-pointer mx-2'
                      onClick={() => addFriend(n.user._id, 'accept')}
                    >+
                    </div>
                  </div>
                </div>
              ))}
              </div>
          :
            <div>No Requests</div>
          )
        )}
        {/*all friends*/}
        { selectedTab == 'all' && (
          (friends ? 
            <div>
              {friends.map(friend => (
              <div 
                className='p-2 my-2 bg-white flex' 
                key={friend._id}>
                <div className='mx-4'>Avatar</div>
                <div className='mx-4'>{friend.username}</div>
                <div 
                  className='p-2 my-2 ml-auto mr-0 bg-red-200 rounded-md cursor-pointer'
                  onClick={() => removeFriend(friend._id)}
                  >Remove Friend
                </div>
            </div> 
              ))}
              friends list
              </div>
          :
            <div>No Friends {':('}</div>
          )
        )}
        
        </div>
    </div>
  )
}

export default Friends
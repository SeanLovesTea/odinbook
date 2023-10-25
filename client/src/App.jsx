import { useEffect, useState } from "react"
import AuthContext from './contexts/Contexts'
import AuthForm from "./AuthForm"
import Home from "./Home"
import Profile from './Profile'
import Friends from './Friends'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [id, setId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [imageURL, setImageURL] = useState(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('http://localhost:4000/profile', {
          credentials: 'include'
        });
  
        if (res.ok) {
          const userData = await res.json()
  
          if (userData.success === true) {
            setCurrentUser(userData.user)
            setId(userData.user._id)
            setImageURL(userData.user.image)
            console.log(imageURL, 'imageURL in app')
          }
        }
      } catch (error) {
        console.log(error)
        console.log('auth failed')
        setCurrentUser(null)
        setId(null)
      }
      console.log(imageURL, 'imageURL in app')
    }
  
    checkAuth()
  }, [])
  
  useEffect(() => {
    console.log(imageURL, 'imageURL in app useeffect')
  },[imageURL])

  async function logout(e) {
    console.log('click')
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:4000/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setCurrentUser(null)
        setId(null)
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
  return (
    <div className=" bg-slate-200 max-w-3xl flex flex-col mx-auto">
      <AuthContext.Provider value={{
        currentUser,
        setCurrentUser,
        id,
        setId,
        selectedUser,
        setSelectedUser,
        }}>
        {currentUser ? (
        <Router>
          <Navbar imageURL={currentUser.image} username={currentUser.username} logout={logout}/>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/friends" element={<Friends />}></Route>
          </Routes>
        </Router>
        ) : <AuthForm /> }
      </AuthContext.Provider>
    </div>
  )
}
export default App 
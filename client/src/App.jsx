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
  
        if (res.status === 200) {
          const userData = await res.json()
  
          if (userData.success === true) {
            setCurrentUser(userData.user)
            setId(userData.user._id)
            setImageURL(userData.user.image)
          }
        }
      } catch (error) {
        console.log(error)
        console.log('auth failed')
        setCurrentUser(null)
        setId(null)
      }
    }
  
    checkAuth()
  }, [])
  
  
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
          <Navbar imageURL={imageURL} username={currentUser.username}/>
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
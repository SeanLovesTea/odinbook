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
  const [avatar, setAvatar] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch('http://localhost:4000/profile',{
        credentials: 'include'
      } )
      if (res.status === 200) {
        const userData = await res.json()

        if (userData.success === true ) {
          // console.log("current user test : ",userData.user )
          setCurrentUser(userData.user)
          setId(userData.user._id)
        }

      } else {
        console.log('auth failed')
        setCurrentUser(null)
        setId(null)
      }
    }
    // console.log("current User : ", currentUser)
    checkAuth()
  },[])
  
  return (
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
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/friends" element={<Friends />}></Route>
          </Routes>
        </Router>
        ) : <AuthForm /> }
      </AuthContext.Provider>
  )
}
// currentUser ? <Page />  : <AuthForm />
export default App 
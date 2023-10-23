import { useEffect, useState, useContext} from 'react'
import AuthContext from './contexts/Contexts'

function AuthForm() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('Register')
  const [message, setMessage] = useState(null)
  const {currentUser, setCurrentUser, id, setId} = useContext(AuthContext)

  async function handleSubmit(e) {
    e.preventDefault();
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  
    const data = { email, username, password, confirmPassword }
    const url = isLoginOrRegister === 'Register' ? 'register' : 'login'

    try {
      const response = await fetch(`http://localhost:4000/${url}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json();
      
      // Handle the response data (result) based on your needs
      if (result.success) {
        // Authentication succeeded
        console.log("this is result : ", result);
        setId(result.user._id)
        setCurrentUser(result.user)
        setMessage(result.message)
      } else {
        // Authentication failed
        setMessage(result.message)
        console.error('Authentication failed:', result.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      // Handle the error gracefully, e.g., display an error message to the user
    }
  }
  async function facebookLogin() {
    console.log('in ere hi')
    try {
      const res = await fetch('http://localhost:4000/login/facebook', {
        method: 'GET',
        credentials: 'include',
      })

    } catch (error) {
      console.log(error)
    }
  }
  async function loginTestUser() {
    const payload = {
      username: 'Test_User',
      password: 'testuser123',
    }
    try {
      const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      console.log(res)
      if(res.ok) {
        setId(data.user._id)
        setCurrentUser(data.user)
        setMessage(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    
    <div className="bg-blue-50 h-screen flex items-center">
      <form onSubmit={handleSubmit} className="w-64 mx-auto mb-12 ">
        <h1 className="mb-12 text-center font-bold">{isLoginOrRegister === 'Register' ? 'Register' : 'Login'}</h1>
        <h3>{message}</h3>
        {isLoginOrRegister === 'Register' && (
        <input 
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          placeholder="email"
          className="w-full rounded-sm p-2 mb-2 border"
        />
        )}
        <input 
          value={username}
          onChange={e => setUsername(e.target.value)}
          type="text"
          placeholder="username"
          className="w-full rounded-sm p-2 mb-2 border"
        />

        <input 
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="password"
          className="w-full rounded-sm p-2 mb-2 border"
        />
        {isLoginOrRegister === 'Register' && (
          <input 
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="confirm password"
            className="w-full rounded-sm p-2 mb-2 border"
          />
        )}
        <button className="mt-6 bg-green-300 p-2 rounded-md w-full flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
        {isLoginOrRegister === 'Register' && (
          <button onClick={() => setIsLoginOrRegister('Login')}>Already a member login here</button>
        )}
         {isLoginOrRegister === 'Login' && (
          <button onClick={() => setIsLoginOrRegister('Register')}>Register account here</button>
        )}
        <div className='flex flex-col'>
          <a href="http://localhost:4000/login/facebook" className='bg-blue-500 p-2 cursor-pointer rounded-md text-white text-center mt-12' >Log in with Facebook</a>
        </div>
        <div 
        onClick={loginTestUser}
        className='p-2 my-2 bg-slate-400 rounded-md text-center cursor-pointer'>
          Log in with Test User
        </div>
      </form>
    
    </div>
  )
}

export default AuthForm

import { useContext } from 'react'
import AuthContext from '../contexts/Contexts'
import '../index.css'

function Logout() {
  const {currentUser, setCurrentUser, id, setId} = useContext(AuthContext)
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
    <div className='p-4 hover:bg-slate-200 mr-0 ml-auto'>
      <form onSubmit={logout} >
        <button type='submit'>Logout</button>
      </form>
    </div>
  )
}

export default Logout
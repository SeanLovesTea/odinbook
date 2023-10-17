import {useState, useContext} from 'react'
import AuthContext from '../contexts/Contexts'

function ProfileModal() {
  const {id} = useContext(AuthContext)
  const [work, setWork] = useState('')
  const [study, setStudy] = useState('')
  const [liveAt, setLiveAt] = useState('')

   async function addAboutInfo(e) {
    e.preventDefault()
    const data = {
      work,
      study,
      liveAt, 
      userId: id,
    }
    try {
      const response = fetch('http://localhost:4000/add-info', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      setWork('')
      setStudy('')
      setLiveAt('')
    } catch (error) {
      console.log(error)
    }
   }
  return (
    <div >
      <form
      onSubmit={e => addAboutInfo(e)} 
      className='bg-slate-200 p-4 m-6 flex flex-col'>
        <input 
          className='p-1 m-1 border-slate-400 border-2 rounded-md'
          onChange={(e) => setWork(e.target.value)}
          value={work} 
          type="text" 
          placeholder='Where do you work?'
          />
        <input
          className='p-1 m-1 border-slate-400 border-2 rounded-md'
          onChange={(e) => setStudy(e.target.value)}
          value={study}
          type="text" 
          placeholder='Where have you studied?'
          />
        <input
          className='p-1 m-1 border-slate-400 border-2 rounded-md'
          onChange={(e) => setLiveAt(e.target.value)}
          value={liveAt} 
          type="text" 
          placeholder='where do you live?'
          />
          <div className='flex justify-center'>
            <button className='p-2 bg-blue-300 border-slate-500 text-sm rounded-md'>Update Profile</button>
          </div>

      </form>
    </div>
  )
}

export default ProfileModal
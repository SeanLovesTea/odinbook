import {useState, useContext} from 'react'
import AuthContext from '../contexts/Contexts'

function ProfileModal({
  openOrCloseModal,
  setAboutData
}) {
  const {currentUser} = useContext(AuthContext)
  const [formInputWork, setFormInputWork] = useState('')
  const [formInputStudy, setFormInputStudy] = useState('')
  const [formInputLocation, setFormInputLocation] = useState('')
  const [formInputImage, setFormInputImage] = useState(null)

   async function addAboutInfo(e) {
    console.log('in add info')
    e.preventDefault()
    const payload = {
      work: formInputWork,
      study: formInputStudy,
      location: formInputLocation, 
      userId: currentUser._id,
    }
    try {
      const response = await fetch('http://localhost:4000/add-info', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      const profileData = data.profile

      setAboutData(profileData)
      resetFormInputs()
      openOrCloseModal()

    } catch (error) {
      console.log(error)
    }
   }

   function resetFormInputs() {
      setFormInputWork('')
      setFormInputStudy('')
      setFormInputLocation('')
   }

  return (
    <div >
      <form
      onSubmit={e => addAboutInfo(e)} 
      className='bg-slate-200 p-4 m-6 flex flex-col'>
        <input 
          className='p-1 m-1 border-slate-400 border-2 rounded-md'
          onChange={(e) => setFormInputWork(e.target.value)}
          value={formInputWork} 
          type="text" 
          placeholder='Where do you work?'
          />
        <input
          className='p-1 m-1 border-slate-400 border-2 rounded-md'
          onChange={(e) => setFormInputStudy(e.target.value)}
          value={formInputStudy}
          type="text" 
          placeholder='Where have you studied?'
          />
        <input
          className='p-1 m-1 border-slate-400 border-2 rounded-md'
          onChange={(e) => setFormInputLocation(e.target.value)}
          value={formInputLocation} 
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
import {useState, useContext, useEffect} from 'react'
import ProfileModal from './components/ProfileModal'
import Post from './components/Post'
import Avatar from './components/Avatar'

function Profile() {
  const [allUserPosts, setAllUserPosts] = useState([])
  const[modalIsOpen, setModalIsOpen] = useState(false)
  const [work, setWork] = useState('')
  const [study, setStudy] = useState('')
  const [location, setLocation] = useState('')
  const [memberSince, setMemberSince] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    getUserDetails()
  },[])
  useEffect(() => {
    if(currentUser) {
      getUserPosts()
    } 
  },[currentUser])

  const editProfile = async () => {
    setModalIsOpen(!modalIsOpen)
  }
  async function getUserDetails() {
    try {
      const response = await fetch(`http://localhost:4000/profile`, {
        method: 'GET',
        credentials: 'include',
        headers:{
          'Content-Type': 'application/json'
        },
      })
      const data = await response.json()

      const profileData = data.user.profile
      setCurrentUser(data.user)
      setAboutData(profileData)
      setMemberSince(new Date(data.user.createdAt).toLocaleDateString())
      setIsLoading(false)

    } catch (error) {
      console.log(error)
    }
  }
  async function getUserPosts() {

    try {
      const response = await fetch(`http://localhost:4000/allposts/${currentUser._id}`, {
        method: 'GET',
        credentials: 'include',
        headers:{
          'Content-Type': 'application/json'
        },
      })
      const data = await response.json()
      const postData = data.data

      const reversePostData = postData.reverse()
      setAllUserPosts(reversePostData)

    } catch (error) {
      console.log(error)
    }

  }
  const setAboutData = (profileData) => {
    setStudy(profileData.study)
    setWork(profileData.work)
    setLocation(profileData.location)
   }
  

  return (
    <div>
      <div className='flex items-center flex-col bg-slate-100 p-2'>
        <div className='w-36 h-36'><Avatar width={36} height={36} /></div>
        <div>{currentUser?.username}</div>
        <button
          onClick={editProfile}
          className='bg-gray-300 p-2 text-sm rounded-md'
          >Edit profile
        </button>
      </div>

      {modalIsOpen && 
        <ProfileModal 
        openOrCloseModal={editProfile}
        setAboutData={setAboutData}
         />}

      <div className='bg-slate-200 p-4 border m-6'>
        <h1 className='font-bold'>About</h1>
        {isLoading ? 
          <div>
            <div>Works at : .. </div>
            <div>Studied at : ..</div>
            <div>Lives at : ..</div>
            <div>Member since : ..</div>
         </div>
          : 
          <div>
            <div>Works at : {work}</div>
            <div>Studied at : {study}</div>
            <div>Lives at : {location}</div>
            <div>Member since : {memberSince}</div>
          </div>
          
        }
        <div className='bg-slate-200 p-4 border m-6'>
          <h1 className='font-bold'>Posts</h1>
          {allUserPosts && allUserPosts.map(post =>
            <Post
            key={post._id}
            text={post.text}
            author={post.author ? post.author.username : "Unknown User"}
            authorId={post.author ? post.author._id : null}
            createdAt={ new Date(post.createdAt).toLocaleDateString()}
            createdAtTime={ new Date(post.createdAt).toLocaleTimeString()}
            postId={post._id}
            currentUserId={currentUser?._id}
            likesArray={post.likes}
            likesLength={post.likes.length}
             />
          )}
        </div>
    </div>
  </div>
  )
}


export default Profile
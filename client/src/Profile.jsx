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
  const [imageUpload, setImageUpload] = useState(false)
  const [imageURL, setImageURL] = useState(null)

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
      console.log(data, "this is user data =====")

      setCurrentUser(data.user)
      setMemberSince(new Date(data.user.createdAt).toLocaleDateString())
      setIsLoading(false)
      setImageURL(data.user.image)
      if(data.user.profile) {
        setAboutData(data.user.profile)
      }
      console.log("imageURL : ", imageURL)
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

  function openOrCloseImageUpload(){
    setImageUpload(!imageUpload)
  }

  function handleImageChange(e){
    const file = e.target.files[0]
    setImageUpload(file)

    // if (file) {
    //   const reader = new FileReader()
    //   reader.onload = e => {
    //     const base64Image = e.target.result
    //     setImageUpload(base64Image)
    //   }
    //   reader.readAsDataURL(file)
    // }
   }
   async function uploadImage(e) {
    e.preventDefault()
    const formData = new FormData()
    formData.append('image', imageUpload)
    formData.append('userId', currentUser._id)
    console.log(imageUpload)

    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        credentials: 'include',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        body: formData,
      })
      const data = await response.json()
      console.log("==================", data)
      setImageURL(data.image)
      setImageUpload(!imageUpload)

    } catch (error) {
      console.error('Error uploading image:', error)
    }
    console.log("imagePath :", imageURL)
  }
  return (
    <div>
      <div className='flex items-center flex-col bg-slate-100 p-2'>
        <div className='w-48 h-48 relative'><Avatar imageURL={imageURL} />
          <button 
          className='bg-gray-300 p-2 text-xs rounded-full absolute bottom-5 right-5'
          onClick={openOrCloseImageUpload}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </button>
      </div>
        
        {imageUpload && 
          <form onSubmit={(e) => uploadImage(e)} encType='multipart/form-data'>
            <input
            onChange={handleImageChange}
            type='file'
            name='image'
            />
            <input type='submit'></input>
          </form>
        }
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
            imageURL={imageURL}
             />
          )}
        </div>
    </div>
  </div>
  )
}


export default Profile
import { React, useState, useContext, useEffect } from 'react'
import Post from './Post'
import AuthContext from '../contexts/Contexts'

function Feed() {
  const [postToAdd, setPostToAdd] = useState('')
  const [allPosts, setAllPosts] = useState([])
  const {currentUser, setCurrentUser, id, setId, selectedUser, setSelectedUser} = useContext(AuthContext)

  useEffect(() => {
    getPosts()
  },[])
 
  async function getPosts() {

    try {
      const response = await fetch('http://localhost:4000/posts', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      const reverseData = data.reverse()
      setAllPosts(reverseData)

    } catch (error) {
      console.log(error)
    }
    
  }
  async function addPost(e) {
    e.preventDefault()
    if(postToAdd === '') {
      return
    }
    const data = {
      text: postToAdd,
      author: id,
    }
    try {
      const response =  await fetch('http://localhost:4000/post/add', {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText)
      } else {
          setPostToAdd('')
          getPosts() 
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='flex-grow h-full'>
      <form 
        onSubmit={(e) => addPost(e)}
        className='bg-white p-2 rounded-md relative border border-slate-400' 
        action="submit">
        <textarea
          className='h-full w-full resize-none p-2 pb-16' 
          placeholder='Something on your mind?'
          type="text"
          onChange={e => setPostToAdd(e.target.value)}
          value={postToAdd}
        />
        <button 
          type='submit' 
          className='bg-blue-300 p-2 text-sm rounded-md absolute right-3 bottom-3'>
          Post
        </button>
      </form>
      {allPosts.map((post) => (
        <Post
          key={post._id}
          text={post.text}
          author={post.author ? post.author.username : "Unknown User"}
          authorId={post.author ? post.author._id : null}
          createdAt={ new Date(post.createdAt).toLocaleDateString()}
          createdAtTime={ new Date(post.createdAt).toLocaleTimeString()}
          postId={post._id}
          currentUserId={id}
          likesArray={post.likes}
          likesLength={post.likes.length}
        />
      ))} 
    </div>
  )
}

export default Feed
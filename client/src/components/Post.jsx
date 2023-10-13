import { useState, useEffect } from 'react'
import Comment from './Comment'

function Post({
  text,
  author,
  authorId,
  createdAt,
  createdAtTime,
  postId,
  currentUserId,
  likesArray,
  likesLength,
}) {
 
  const [like, setLike] = useState(false)
  const [numberOfLikes, setNumberOfLikes] = useState(likesLength)

  useEffect(() => {
    setLike(likesArray.some((like) => like?.author?._id === currentUserId ))
  }, [])

  async function likePost(postId) {

    const currentpostId = {
      like,
      postId,
      currentUserId
     }
    try {
      const response = await fetch('http://localhost:4000/like', {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify(currentpostId)
      })

      const data = await response.json()

      setNumberOfLikes(data.numberOfLikes)

      data.like ? setLike(true) : setLike(false)

    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className='p-2 mt-2 mb-8 bg-slate-300 rounded-md border border-slate-400 relative'>
      <div className='flex p-4'>
        <div className='w-1/4'>
          <div>Avatar</div>
          <div>{author}</div>
          <div className='overflow-hidden'>{createdAt}</div>
          <div className='overflow-hidden'>{createdAtTime}</div>
        </div>
        <div className='flex-grow text-center'>{text}</div>
      </div>
      <div className='flex justify-around border-t py-2'>
       {like ? (
        <div
        className='w-2/5 cursor-pointer hover:bg-red-100 text-center border-b border-green-300 relative'
        onClick={() => likePost(postId)}
        ><span className='absolute left-2 text-sm text-blue-600'>{numberOfLikes}</span>unlike
      </div>
        ) : (
          <div
          className='w-2/5 cursor-pointer hover:bg-green-100 text-center border-b relative'
          onClick={() => likePost(postId)}
          ><span className='absolute left-2 text-sm  text-blue-600'>{numberOfLikes}</span>like
        </div> 
          
        )}
        <div 
          className=' w-2/5 cursor-pointer hover:bg-slate-100 text-center border-b'
          >Comment
        </div>
      </div>
      <Comment postId={postId} postAuthorId={authorId} currentUserId={currentUserId}/>
    </div>
  )
}

export default Post
import {useEffect, useState} from 'react'

function Comment({postAuthorId, currentUserId, postId}) {

  const [comment, setComment] = useState('')
  const [allComments, setAllComments] = useState([])

  useEffect(() => {
    getComments()
  }, [])

  async function addComment(e) {
    const data = {
      text: comment,
      postAuthor: postAuthorId,
      commentAuthor: currentUserId,
      postId,
    }
    e.preventDefault()
    try {
      const reponse = await fetch('http://localhost:4000/comment/add', {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify(data)
      })
    } catch (error) {
      console.log(error)
    }
    setComment('')
    getComments()
  }
  async function getComments() {
    try {
      const response = await fetch(`http://localhost:4000/comments/${postId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          "Content-Type": 'application/json'
        }
      })
      const data = await response.json()

      setAllComments(data)

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      {allComments?.map((comment) => (
        <div 
          className='flex p-4 bg-slate-200 border-2 border-slate-400 my-2'
          key={comment._id}
        >
          <div className='w-1/4'>
            <div className='text-xs'>Avatar</div>
            <div className='text-xs'>{comment.author ? comment.author.username : "Unknown User"}</div>
            <div className='text-xs'>{new Date(comment.createdAt).toLocaleDateString()}</div>
            <div className='text-xs'>{new Date(comment.createdAt).toLocaleTimeString()}</div>
          </div>
          <div className='flex-grow text-center'>{comment.text}</div>
        </div>
      ))}
      <div className='border-2 border-slate-400 w-full rounded-md relative'>
          <form onSubmit={e => addComment(e)}>
            <textarea 
              className='w-full p-2 resize-none'
              placeholder='make a comment..'
              onChange={e => setComment(e.target.value)}
              value={comment}>
            </textarea>
            <button className='absolute right-1 bottom-1 bg-blue-300 p-1 px-2 rounded-md'>+</button>
          </form>
        </div>
    </div>
  )
}

export default Comment
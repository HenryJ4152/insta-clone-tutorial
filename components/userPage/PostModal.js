import { useSession } from "next-auth/react"
import { useRef, useState } from "react"
import { useRecoilState } from "recoil"
import { showPostState } from "../../atoms/showPostAtom"
import { FaceSmileIcon } from "@heroicons/react/24/outline"

import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'


function PostModal() {

  const { data: session } = useSession()
  const [showPost, setShowPost] = useRecoilState(showPostState)
  const outsideRef = useRef()
  const insideRef = useRef()
  const [comment, setComment] = useState("")


  function handleClickOutside(e) {
    if (outsideRef.current && !insideRef.current.contains(e.target)) {
      setShowPost(null)
    }
  }

  const sendComment = async (e) => {
    e.preventDefault()

    const commentToSend = comment
    setComment('')

    await addDoc(collection(db, "posts", showPost.id, "comments"), {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
  }


  console.log(showPost)
  console.log(showPost.id)

  return (
    <div onClick={e => handleClickOutside(e)} ref={outsideRef} className="fixed inset-0  bg-black bg-opacity-50 z-50 flex items-center justify-center">

      <div ref={insideRef} className="bg-white flex  space-x-3">

        <img
          className=" object-cover max-h-[80vh]  "
          src={showPost.imageURL} alt="post image"
        />

        <div className="flex flex-col">
          <div className="flex items-center space-x-2 px-3 pt-6">
            <img className="h-10 rounded-full" src={showPost.profileImg} alt="profileImg" />
            <p className=" font-bold text-md">{showPost.username}</p>
            <p className=" text-md">{showPost.caption}</p>
          </div>


          {session && (
            <form className='flex items-center p-4 w-full mt-auto'>
              <FaceSmileIcon className='h-7' />
              <input
                type="text"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder='Add a commnet...'
                className=' border-none focus:ring-0 bg-gray-100 rounded-xl flex-1 mx-3'
              />
              <button
                type='submit'
                disabled={!comment.trim()}
                onClick={e => sendComment(e)}
                className='font-semibold text-blue-400'
              >
                Post
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}

export default PostModal
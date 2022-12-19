import {
  BookmarkIcon,
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  FaceSmileIcon,
  HeartIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'

import {
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { db, storage } from '../firebase'
import Moment from 'react-moment';
import { deleteObject, ref } from 'firebase/storage'
import Link from 'next/link'


function Post({ id, username, userImg, img, caption }) {

  const { data: session } = useSession()
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState([])
  const [hasLiked, setHasLiked] = useState(false)
  const [optionOpen, setOptionOpen] = useState(false)
  const deleteRef = useRef()
  const ellipsisIconRef = useRef()




  //grab comments
  useEffect(() => {
    const q = query(collection(db, "posts", id, "comments"), orderBy("timestamp", "desc"))

    const unsub = onSnapshot(q, (querySnapshot) => {

      const comments = []
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        const comment = {
          ...doc.data(),
          id: doc.id,
        }
        comments.push(comment)
      })

      setComments(comments)
      console.log(comments)
    })

    return unsub
  }, [db, id])


  //grab likes
  useEffect(() => {
    const q = query(collection(db, "posts", id, "likes"))

    const unsub = onSnapshot(q, (querySnapshot) => {

      const likes = []
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        const like = {
          ...doc.data(),
          id: doc.id,
        }
        likes.push(like)
      })

      setLikes(likes)
      console.log(likes)
    })

    return unsub
  }, [db, id])

  //check if current user has liked this post
  useEffect(() => {

    setHasLiked(likes.findIndex(like => like.id === session?.user?.uid) !== -1)

  }, [likes])




  const likePost = async () => {
    if (!hasLiked) {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.username,
        userImage: session.user.image,
        // timestamp: serverTimestamp(),
      });
    } else {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    }
  }



  const sendComment = async (e) => {
    e.preventDefault()
    console.log(id);

    const commentToSend = comment
    setComment('')

    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
  }

  //check click outside of deleteref
  useEffect(() => {
    function handleClickOutside(e) {
      if (deleteRef.current && !deleteRef.current.contains(e.target) && !ellipsisIconRef.current.contains(e.target)) {
        e.stopPropagation()
        console.log('clicked outside of deleteRef')
        setOptionOpen(false)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deleteRef]);

  //delete post
  const deletePost = async () => {

    await deleteDoc(doc(db, "posts", id))

    const commentDocs = await getDocs(collection(db, "posts", id, "comments"));
    commentDocs.forEach((document) => {
      // doc.data() is never undefined for query doc snapshots
      deleteDoc(doc(db, "posts", id, "comments", document.id))
    });

    const likeDocs = await getDocs(collection(db, "posts", id, "likes"));
    likeDocs.forEach((document) => {
      // doc.data() is never undefined for query doc snapshots
      deleteDoc(doc(db, "posts", id, "likes", document.id))
    });


    // delete from storage
    const imageRef = ref(storage, `posts/${id}/image`);
    deleteObject(imageRef).then(() => {
      console.log('delete from storage success');
    }).catch((error) => {
      console.log('error deleting from storage')
    });

  }





  return (
    <div className='bg-white my-7 rounded-sm  '>
      {/* Header */}
      <div className='flex items-center px-3 py-5 justify-between '>
        <Link className='flex items-center ' href={`/${username}`}>
          <img src={userImg} className="rounded-full h-12 w-12 object-contain border p-1 mr-2" alt="userImg" />
          <p className='flex-1 font-bold'>{username}</p>
        </Link>

        <div className='relative'>
          <EllipsisHorizontalIcon onClick={() => setOptionOpen(!optionOpen)} className='h-5 cursor-pointer btn' ref={ellipsisIconRef} />
          {optionOpen && (

            <div className='absolute top-6 right-0 border border-gray-400 shadow-lg bg-white px-3 rounded-md' ref={deleteRef}>
              <p className='text-red-500 cursor-pointer' onClick={deletePost} >Delete</p>
            </div>
          )}
        </div>
      </div>

      {/* img */}
      <img src={img} className=" object-cover w-full" alt="img" />

      {/* Buttons */}
      {session && (
        <div className='flex justify-between items-center px-4 pt-4'>
          <div className='flex space-x-4 pt-3'>
            {hasLiked ? (
              <HeartIconSolid onClick={likePost} className='btn text-red-500' />
            ) : (
              <HeartIcon onClick={likePost} className='btn' />
            )}
            <ChatBubbleLeftIcon className='btn' />
            <PaperAirplaneIcon className='btn' />
          </div>

          <BookmarkIcon className='btn ' />
        </div>
      )}

      {/* caption */}
      <p className='p-5 truncate '>
        {likes.length == 1 && (
          <p className='font-bold mb-1'>{likes.length} like</p>
        )}
        {likes.length > 0 && likes.length != 1 && (
          <p className='font-bold mb-1'>{likes.length} likes</p>
        )}

        <span className='font-bold mr-1'>
          <Link href={`/${username}`}>
            {username}
          </Link>
        </span>{caption}
      </p>

      {/* comments */}
      {comments.length > 0 && (
        <div className=' ml-7 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>

          {comments.map(comment => (
            <div
              key={comment.id}
              className='flex items-center space-x-2 mb-3'
            >
              <img
                className=' h-7 rounded-full'
                src={comment.userImage} alt="profileImg"
              />
              <p className='text-sm flex-1'>
                <span className=' font-bold'>{comment.username}</span>
                {" "}
                {comment.comment}
              </p>
              <Moment fromNow className='pr-5 text-xs'>
                {comment.timestamp?.toDate()}
              </Moment>

            </div>
          ))}

        </div>
      )}

      {/* input box */}
      {session && (
        <form className='flex items-center p-4'>
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
            onClick={sendComment}
            className='font-semibold text-blue-400'
          >
            Post
          </button>
        </form>
      )}

    </div>
  )
}

export default Post
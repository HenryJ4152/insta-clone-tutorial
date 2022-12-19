import Post from './Post'
import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from '../firebase';


function Posts({ ssrPosts }) {

  const [csrPosts, setCsrPosts] = useState([])
  // deleted useState so only use CSR posts after a post has been deleted
  const [csrLoaded, setCsrLoaded] = useState(false)

  //get posts client side
  useEffect(() => {

    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"))

    const unsub = onSnapshot(q, (snapshot) => {

      const posts = []
      snapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        const post = {
          ...doc.data(),
          id: doc.id,
        }
        posts.push(post)
      })

      setCsrPosts(posts)
      setCsrLoaded(true)
      console.log(posts)



    })


    return unsub

  }, [db])


  return (
    <div>
      {/* react knows how to compare Post rendered from csrPosts to Post rendered from ssrPosts and only makes changes accordingly */}

      {/* if ssrPosts = 0 */}
      {csrLoaded ?

        (csrPosts.map(post => (

          <Post
            key={post.id}
            id={post.id}
            username={post.username}
            userImg={post.profileImg}
            img={post.imageURL}
            caption={post.caption}
          />
        )))
        :
        // <div>hi</div>
        (ssrPosts.map(post => (

          <Post
            key={post.id}
            id={post.id}
            username={post.username}
            userImg={post.profileImg}
            img={post.imageURL}
            caption={post.caption}
          />
        )))
      }
    </div>
  )
}

export default Posts
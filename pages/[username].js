import Head from "next/head"
import Header from "../components/Header"
import { useRouter } from "next/router"
import ProfileHeader from "../components/userPage/ProfileHeader"
import Posts from "../components/userPage/Posts"
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import PostModal from "../components/userPage/PostModal"
import { useRecoilState } from "recoil"
import { showPostState } from "../atoms/showPostAtom"
import CreatePostModal from "../components/CreatePostModal"


function UserPage({ posts }) {
  const router = useRouter()
  const { username } = router.query
  const [showPost, setShowPost] = useRecoilState(showPostState)

  console.log(posts)

  return (
    <div className="relative bg-gray-200 h-screen overflow-y-scroll scrollbar-hide">
      <Head>
        <title>Instagram</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <CreatePostModal />
      <ProfileHeader />
      <Posts posts={posts} />
      {showPost &&
        <PostModal />
      }


    </div>
  )
}

export default UserPage

export const getServerSideProps = async () => {
  console.log('first')
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"))

  const querySnapshot = await getDocs(q);
  const posts = []
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    const post = {
      ...doc.data(),
      id: doc.id,
      timestamp: null,
    }
    posts.push(post)
  });

  return {
    props: {
      posts
    }
  }

}


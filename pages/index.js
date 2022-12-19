import Head from 'next/head'
import Header from '../components/Header'
import Feed from '../components/Feed'
import CreatePostModal from '../components/CreatePostModal'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'


const Home = ({ posts }) => {

  console.log(posts);
  return (
    <div className=" bg-gray-200 h-screen overflow-y-scroll scrollbar-hide">
      <Head>
        <title>Instagram</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <CreatePostModal />
      <Header />
      <Feed posts={posts} />


    </div>
  )
}

export default Home

export const getServerSideProps = async () => {

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

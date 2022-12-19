import { useRecoilState } from "recoil";
import { showPostState } from "../../atoms/showPostAtom"
import { HeartIcon, ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid"


function Posts({ posts }) {

  const [showPost, setShowPost] = useRecoilState(showPostState)

  console.log(posts);

  return (
    <div className={`grid grid-cols-1 mb-36 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto 2xl:space-x-5 bg-white py-3 pb-10`}>
      {posts?.map(post => (

        <div onClick={() => setShowPost(post)} className="relative group cursor-pointer h-96">
          <img src={post.imageURL} alt="post image"
            className=" object-cover h-96 w-96 "
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 hidden group-hover:flex items-center justify-center text-white space-x-2">
            <div>1</div> <HeartIcon className="h-7 text-white" />
            <div>1</div> <ChatBubbleBottomCenterIcon className="h-7 text-white" />
          </div>
        </div>

      ))}
    </div>
  )
}

export default Posts


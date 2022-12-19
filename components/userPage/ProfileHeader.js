import { useSession } from "next-auth/react"

function ProfileHeader() {

  const { data: session } = useSession()

  return (
    <div className=" md:max-w-3xl  xl:max-w-6xl mx-auto flex justify-center space-x-3 py-16 bg-white">
      <img src={session?.user?.image} className=" w-32 rounded-full " alt="" />

      <div className="flex flex-col space-y-2 ">

        <div className=" flex space-x-2">
          <h1>{session?.user?.username}</h1>
          <button>Following</button>
          <button>Message</button>
          <button>Ellipses Icon</button>
        </div>

        <div className="flex space-x-2">
          <p>111 posts</p>
          <p>111 followers</p>
          <p>111 following</p>
        </div>


        <p>Henry J</p>
        <p>Ascension</p>
      </div>
    </div>
  )
}

export default ProfileHeader
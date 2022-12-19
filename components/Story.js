
function Story({ id, img, username }) {

  return (
    <div className="group" >
      <img
        className=" h-14 w-14 rounded-full p-[1.5px] border-red-500 border-2 object-contain cursor-pointer  group-hover:scale-110 transition transform duration-200 ease-out"
        src={img} alt="story image"
      />
      <p className="text-xs w-14 truncate text-center cursor-pointer">{username}</p>
    </div>
  )
}




export default Story
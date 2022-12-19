import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useRef, useState } from "react";
import { CameraIcon } from "@heroicons/react/24/outline";
import { app, db, storage } from "../firebase"
import { addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";


function CreatePostModal() {

  const { data: session } = useSession()
  const [open, setOpen] = useRecoilState(modalState);
  const filePickerRef = useRef(null)
  const captionRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const addImageToPost = (e) => {
    const reader = new FileReader()
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result)
    }
  }


  const uploadPost = async () => {
    if (loading) return

    setLoading(true)

    console.log(selectedFile)
    console.log(captionRef.current.value)

    const docRef = await addDoc(collection(db, "posts"), {
      username: session.user.username,
      caption: captionRef.current.value,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    });
    console.log("Document written with ID: ", docRef.id);

    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    const snapshot = await uploadString(imageRef, selectedFile, 'data_url')

    const downloadURL = await getDownloadURL(snapshot.ref)

    console.log('File available at', downloadURL);

    await updateDoc(docRef, {
      imageURL: downloadURL
    });

    setOpen(false)
    setLoading(false)
    setSelectedFile(null)
    captionRef.current.value = ''
  }



  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full mt-12 items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">

                {selectedFile ? (
                  <img
                    className=" w-full object-contain cursor-pointer mb-5"
                    onClick={() => setSelectedFile(null)}
                    src={selectedFile}
                    alt="selectedFile"
                  />
                ) : (

                  <div
                    onClick={() => filePickerRef.current.click()}
                    className=" mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer mb-5"
                  >
                    <CameraIcon
                      className=" h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                )}

                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Upload a photo
                </Dialog.Title>

                {/* file picker */}
                <div className="mt-2">
                  <input
                    ref={filePickerRef}
                    type="file"
                    hidden
                    onChange={addImageToPost}
                  />
                </div>

                {/* caption */}
                <div className="mt-2">
                  <input
                    type="text"
                    ref={captionRef}
                    className="border-none focus:ring-0 w-full text-center"
                    placeholder="Enter a caption"
                  />
                </div>

                {/* upload */}
                <div className="mt-4">
                  <button
                    type="button"
                    disabled={!selectedFile}
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
                    onClick={uploadPost}
                  >
                    {loading ? "Uploading..." : "Upload Post"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition >
  )
}

export default CreatePostModal
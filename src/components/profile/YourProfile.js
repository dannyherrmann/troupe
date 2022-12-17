import { useState, useEffect, Fragment } from "react"
import { Link, useNavigate } from "react-router-dom";
import { photoStorage } from "./PhotoStorage"
import { FetchLoggedInUser, UpdateUserPhoto, PatchUser } from "../ApiManager";
import { getAuth, updateEmail } from "firebase/auth";
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'


export const YourProfile = () => {

  const troupeUser = localStorage.getItem("troupe_user");
  const troupeUserObject = JSON.parse(troupeUser)
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [user, setUser] = useState({
    id: '',
    uid: '',
    name: '',
    email: '',
    photo: '',
    bio: ''
  })
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false)

  const navigate = useNavigate()

    const fetchUser = async () => {
        const userArray = await FetchLoggedInUser(troupeUserObject.userId)
        setUser(userArray)
    }

    useEffect(() => {
       fetchUser() 
    }, [])

    // Handles selecting an image
    const handleChange = (event) => {
      if (event.target.files[0]) {
        setImage(event.target.files[0]);
      }
      const imagePreview = document.getElementById('image-preview')
      imagePreview.src = URL.createObjectURL(event.target.files[0])
    };

      // Handles calling the upload image function
  const handleUpload = async () => {
    const photoObject = await photoStorage.upload("images", image)
      // Returns image object, you will want to add these properties
      // to an object in your database
      // EX: a user if it's a profile picture
      console.log(`URL`,photoObject.downloadURL)

    await UpdateUserPhoto(troupeUserObject.userId,{"photo": photoObject.downloadURL})
    const copyStorage = { ...troupeUserObject }
    copyStorage.photo = photoObject.downloadURL
    localStorage.setItem(
      "troupe_user",JSON.stringify(copyStorage))
  };

  async function updateEmailForCurrentUser(email) {
    const auth = getAuth()
    console.log(`test`,auth.currentUser)
    return await updateEmail(auth.currentUser, email)
  }

  const handleSave = async (clickEvent) => {
    clickEvent.preventDefault()
    
    if (image != null) {
      const photoObject = await photoStorage.upload("images", image)
      console.log(`URL`,photoObject.downloadURL)
      await UpdateUserPhoto(troupeUserObject.userId,{"photo": photoObject.downloadURL})
      setImageUrl(photoObject.downloadURL)
    }
    // updateEmailForCurrentUser(user.email)
    await PatchUser(troupeUserObject.userId, {"name": user.name, "bio": user.bio, "email": user.email})
    navigate("/")
    window.location.reload(false) 

  }

    return (
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 pt-8">
      <form className="space-y-6" onSubmit={handleSave}>
        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will be displayed publicly so be careful what you share.
              </p>
            </div>
            <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
              
            <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={user.name}
                    onChange={
                      (event) => {
                        const copy = {...user}
                        copy.name = event.target.value
                        setUser(copy)
                      }
                    }
                    name="first-name"
                    id="first-name"
                    
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
               
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="text"
                    value={user.email}
                    onChange={
                      (event) => {
                        const copy = {...user}
                        copy.email = event.target.value
                        setUser(copy)
                      }
                    }
                    name="last-name"
                    id="last-name"
                    
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
  
              <div>
                <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="about"
                    name="about"
                    rows={7}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="add your bio here"
                    value={user.bio}
                    onChange={
                      (event) => {
                        const copy = {...user}
                        copy.bio = event.target.value
                        setUser(copy)
                      }
                    }
                  />
                </div>
                
              </div>

              
  
              <div>
                <label className="block text-sm font-medium text-gray-700">Photo</label>
                <div className="mt-1 flex items-center space-x-5">
                  <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                  <img
                          id="image-preview"
                          className="h-12 w-12 rounded-full"
                          src={user.photo}
                          alt=""
                        />
                  </span>
                  <input type="file" className="text-sm font-medium text-gray-700" onChange={(event) => handleChange(event)} />
                </div>
              </div>

            </div>
          </div>
        </div>
  
        <div className="flex justify-end">
          <Link to="/">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          </Link>
          <button
            type="submit"
            onClick={(clickEvent) => handleSave(clickEvent)}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </form>

      <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Payment successful
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur amet labore.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Go back to dashboard
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

      </div>
    )
  }
  
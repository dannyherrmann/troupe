import { useState, useEffect, Fragment } from "react"
import { Link, useNavigate } from "react-router-dom";
import { photoStorage } from "./PhotoStorage"
import { FetchLoggedInUser, UpdateUserPhoto, PatchUser } from "../ApiManager";
import { getAuth, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { Dialog, Transition } from '@headlessui/react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

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
    phone: '',
    photo: '',
    bio: ''
  })
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false)
  const [currentProfile, setCurrentProfile] = useState({
    name: '',
    email: '',
    bio: ''
  })
  const [phone, setPhone] = useState("")

  const handlePhoneInputChange = value => {
    setPhone(value)
  }

  const navigate = useNavigate()

    const fetchUser = async () => {
        const userArray = await FetchLoggedInUser(troupeUserObject.userId)
        const userPhone = userArray.phone
        setPhone(userPhone)
        const currentProfile = {
          name: userArray.name,
          email: userArray.email,
          bio: userArray.bio
        }
        setUser(userArray)
        setCurrentProfile(currentProfile)
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

  const handleSave = async (clickEvent) => {
    clickEvent.preventDefault()
    //check if user is changing email. if so, open up modal window for them to reauthenticate so email can be changed in firebase.
    if (currentProfile.email != user.email) {
      const newEmail = user.email
      const auth = getAuth()
      const firebaseUser = auth.currentUser
      const credential = EmailAuthProvider.credential(currentProfile.email, password)
      const reauth = getAuth()
      await reauthenticateWithCredential(reauth.currentUser, credential)
      await updateEmail(firebaseUser, newEmail)
      await PatchUser(troupeUserObject.userId, {"email": newEmail})
    }

    //check if user is updating their photo. if so, upload photo to firebase storage. 
    if (image != null) {
      const photoObject = await photoStorage.upload("images", image)
      console.log(`URL`,photoObject.downloadURL)
      await UpdateUserPhoto(troupeUserObject.userId,{"photo": photoObject.downloadURL})
      setImageUrl(photoObject.downloadURL)
    }

    if (currentProfile.name != user.name) {
      await PatchUser(troupeUserObject.userId, {"name": user.name})
    }

    if (currentProfile.bio != user.bio) {
      await PatchUser(troupeUserObject.userId, {"bio": user.bio})
    }

    if (currentProfile.phone != phone) {
      await PatchUser(troupeUserObject.userId, {"phone": phone})
    }

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

                  <div className="relative mt-1 rounded-md shadow-sm">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                    <PhoneInput 
                    prefix="+"
                    name="phoneNumber"
                    type="text"
                    country={"us"}
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={handlePhoneInputChange}
                    inputStyle={{
                      color: "black",
                      width: "100%",
                    }}
                    />
                  </div>
                  <div className="absolute inset-y-0 left-0 flex items-center">

 
                  </div>
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
                          className="h-12 w-12 rounded-full object-cover"
                          src={user.photo}
                          alt=""
                        />
                        
                  </span>
                  <input type="file" className="text-sm font-medium text-gray-700" onChange={(event) => handleChange(event)} />
                </div>
              </div>
              <div>

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
            type="button"
            onClick={(clickEvent) => {
              if (currentProfile.email != user.email) {
                setOpen(true)
              } else {
                handleSave(clickEvent)
              } 
            }}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Update
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
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Update Profile
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please type in your password below to save your profile
                      </p>
                    </div>

                <div className="mt-3">
                  <input
                    id="password"
                    value={password}
                    onChange={(evt) => setPassword(evt.target.value)}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={(clickEvent) => handleSave(clickEvent)}
                  >
                    Save Profile
                  </button>
                
                  <button
                    onClick={() => {
                      const copy = user
                      copy.email = currentProfile.email
                      setUser(copy)
                      setPassword('')
                      setOpen(false)
                    }}
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-3"
                  >
                    Cancel
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
  
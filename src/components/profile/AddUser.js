import { useState, useEffect, Fragment } from "react"
import { Link, useNavigate } from "react-router-dom";
import { FetchEventTypes, FetchUserTypes, AddNewUser, AddUserTroupe, FetchUsers } from "../ApiManager";
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export const AddUser = () => {
  const troupeUser = localStorage.getItem("troupe_user");
  const troupeUserObject = JSON.parse(troupeUser)
  const [userTypes, setUserTypes] = useState([])
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: 'dPH!596262'
  })
  const [selectedUserType, setSelectedUserType] = useState({
    id: 1, 
    name: "Performer" 
  })
  const [allUsers, setAllUsers] = useState([])


  const fetchAllUsers = async () => {
    const userArray = await FetchUsers()
    setAllUsers(userArray)
  }

  const getUserTypes = async () => {
    const userTypes = await FetchUserTypes()
    setUserTypes(userTypes)
  } 

  useEffect(() => {
    getUserTypes()
  }, [])

    useEffect(() => {
    fetchAllUsers()
  }, [])

  console.log(userTypes)

  const navigate = useNavigate()
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const emailAuth = {
    // Register New User
    register: function(userObj) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, userObj.email, userObj.password)
        .then((userCredential) => {
          const auth = getAuth();
          updateProfile(auth.currentUser, {
            displayName: userObj.name,
          }).then(
            function() {
              const userAuth = {
                email: userCredential.user.email,
                displayName: userObj.fullName,
                uid: userCredential.user.uid,
                type: "email",
              };
            },
            function(error) {
              console.log("Email Register Name Error");
              console.log("error code", error.code);
              console.log("error message", error.message);
            }
          );
        })
        .catch((error) => {
          console.log("Email Register Error");
          console.log("error code", error.code);
          console.log("error message", error.message);
        });
    }}

  const leaderCheck = (userTypeId) => {
    if (userTypeId === 2 || userTypeId === 3) {
        return true
    } else {
        return false
    }
  }

  const createNewTroupeUser = async (event) => {
    event.preventDefault()

    let uid = ''

    

    const userCheck = (email) => {
      const existingUser = allUsers.find(allUser => allUser.email === email)
      console.log(existingUser)

      if (existingUser != undefined) {
        return true
      } 
      
      if (existingUser === undefined) {
        return false
      }

    }
   

    const getExistingUserId = (email) => {
      const existingUser = allUsers.find(allUser => allUser.email === email)
      return existingUser.id
    }

    const addUserFirebase = async () => {
      console.log(`userCheck=`,userCheck(user.email))
      if (userCheck(user.email) === false) {
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password)
        uid = userCredential.user.uid
        updateProfile(auth.currentUser, {
            displayName: user.name,
        })
      }
    }


    const addUserMockDB = async () => {
      if (userCheck(user.email) === false) {
        const newUser = {
          uid: uid,
          name: user.name,
          email: user.email
      }
      console.log(`newUser`,newUser)
      const newUserResponse = await AddNewUser(newUser)
      console.log(`newUserResponse`,newUserResponse)
      const newUserTroupe = {
        userId: newUserResponse.id,
        troupeId: troupeUserObject.troupeId,
        isLeader: leaderCheck(selectedUserType.id),
        userTypeId: selectedUserType.id
    }
    console.log(`newUserTroupe`,newUserTroupe)
    await AddUserTroupe(newUserTroupe)
      } else {
        const newUserTroupe = {
          userId: getExistingUserId(user.email),
          troupeId: troupeUserObject.troupeId,
          isLeader: leaderCheck(selectedUserType.id),
          userTypeId: selectedUserType.id
      }
      await AddUserTroupe(newUserTroupe)
      }
    }

    await addUserFirebase()
    await addUserMockDB()
    navigate("/myTroupe")
    window.location.reload(false) 
  }




    return (
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 pt-8">
      <form className="space-y-6" onSubmit={createNewTroupeUser}>
        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">New User</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a new user to the {troupeUserObject.troupeName} troupe!
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
                    Email Address
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
                <div className="col-span-6 sm:col-span-3">
                
                <Listbox value={selectedUserType} onChange={setSelectedUserType}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">Assigned to</Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <span className="block truncate">{selectedUserType.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {userTypes.map((userType) => (
                  <Listbox.Option
                    key={userType.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={userType}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {userType.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>

                </div>
  
              <div>

              </div>
            </div>
          </div>
        </div>
  
        <div className="flex justify-end">
          <Link to="/myTroupe">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          </Link>
          <button
            type="submit"
            
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create User
          </button>
        </div>
      </form>

     

      </div>
    )
}
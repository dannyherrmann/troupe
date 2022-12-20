import { EnvelopeIcon, PhoneIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { FetchTroupeUsers, FetchUserTypes, GetUserTroupe } from '../ApiManager'

export const MyTroupe = () => {

  const troupeUser = localStorage.getItem("troupe_user");
  const troupeUserObject = JSON.parse(troupeUser)

  const [userTypes, setUserTypes] = useState([])
  const [leaders, setLeaders] = useState([])
  const [performers, setPerformers] = useState([])
  const [troupe, setTroupe] = useState({})

  const findUserTypeName = (id, state) => {
    for (const type of state) {
        if (type.id === id) {
            return type.name
        }
    }
  }

  const fetchTroupe = async () => {
    const troupe = await GetUserTroupe(troupeUserObject.troupeId)
    setTroupe(troupe)
  }

  useEffect(() => {
    fetchTroupe()
  }, [])

  const fetchUsers = async () => {
    const userTypes = await FetchUserTypes()
    setUserTypes(userTypes)
    const userArray = await FetchTroupeUsers(troupeUserObject.troupeId)
    const leaders = []
    const performers = []
    for (const user of userArray) {
        if (user.userTypeId === 2 || user.userTypeId === 3) {
            const leader = { ...user }
            leader.userTypeName = findUserTypeName(user.userTypeId, userTypes)
            leaders.push(leader)
        } else {
            const performer = { ...user }
            performer.userTypeName = findUserTypeName(user.userTypeId, userTypes)
            performers.push(performer)
        }
    }
    setLeaders(leaders)
    setPerformers(performers)
}

useEffect(() => {
    fetchUsers()
  }, []);

  function formatPhoneNumber2(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return ['(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
  }

  return (

    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 py-10">

    <div className="sm:flex sm:items-center">
    <header>
            <div className="sm:flex-auto">
             <span className="relative flex min-w-0 flex-1 items-center">
            <img
                          className="h-10 w-10 rounded-full object-cover mr-2"
                          src={troupe.logo}
                          alt=""
            />
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                {troupe.name}
              </h1>
            </span>
            </div>
            
            <div className="mt-4 sm:flex-auto">
                        {troupeUserObject.troupeLeader ? (
                          <>
                          <Link to="addUser">
                            <button
                              type="button"
                              className="mt-5 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"

                            >
                              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                              <span>New User</span>
                            </button>
                            </Link>
                          </>
                        ) : (
                          <></>
                        )}
              </div>
      </header> 
      </div>
         <div className="px-4 py-8 sm:px-0">
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {leaders.map((leader) => (
        <li
          key={leader.user.email}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-8">
          <div className="mb-5">
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  {leader.userTypeName}
                </span>
                </div>
            {
              leader.user.photo ? (
                <>
                <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full object-cover" src={leader.user.photo} alt="" />
                </>
              ) : (
                <> 
                <span className="mx-auto h-32 w-32 overflow-hidden rounded-full bg-gray-100">
                  <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                </>
              )
            }
            
            <h3 className="mt-6 text-sm font-medium text-gray-900">{leader.user.name}</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Role</dt>
              <dd className="mt-2">
              <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-black">
                  {leader.user.email}
                </span>
              </dd>
              {
                leader.user.phone ? (
                  <>
              <dd className="mt-2">
              <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-black">
                  {formatPhoneNumber2(leader.user.phone)}
                </span>
              </dd>
                  </>
                ) : (
                  <>
                  </>
                )
              }
            </dl>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <a
                  href={`mailto:${leader.user.email}`}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-3">Email</span>
                </a>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <a
                  href={`tel:${leader.user.phone}`}
                  className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-3">Call</span>
                </a>
              </div>
            </div>
          </div>
        </li>
      ))}
      {performers.map((performer) => (
        <li
          key={performer.user.email}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-8">
            <div className="mb-5">
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {performer.userTypeName}
                </span>
                </div>
                {
              performer.user.photo ? (
                <>
                <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full object-cover" src={performer.user.photo} alt="" />
                </>
              ) : (
                <> 
                <span className="mx-auto h-32 w-32 overflow-hidden rounded-full bg-gray-100">
                  <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                </>
              )
            }
            
            <h3 className="mt-6 text-sm font-medium text-gray-900">{performer.user.name}</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Role</dt>
              <dd className="mt-2">
              <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-black">
                  {performer.user.email}
                </span>
              </dd>
              {
                performer.user.phone ? (
                  <>
              <dd className="mt-2">
              <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-black">
                  {formatPhoneNumber2(performer.user.phone)}
                </span>
              </dd>
                  </>
                ) : (
                  <>
                  </>
                )
              }
            </dl>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <a
                  href={`mailto:${performer.user.email}`}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-3">Email</span>
                </a>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <a
                  href={`tel:${performer.user.phone}`}
                  className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-3">Call</span>
                </a>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
    </div>
    </div>

  )
}


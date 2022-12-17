import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'
import { useState, useEffect } from 'react'
import { FetchTroupeUsers, FetchUserTypes } from '../ApiManager'

export const MyTroupe = () => {

  const troupeUser = localStorage.getItem("troupe_user");
  const troupeUserObject = JSON.parse(troupeUser)

  const [userTypes, setUserTypes] = useState([])
  const [leaders, setLeaders] = useState([])
  const [performers, setPerformers] = useState([])

  const findUserTypeName = (id, state) => {
    for (const type of state) {
        if (type.id === id) {
            return type.name
        }
    }
  }

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

  return (

    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 pt-8">
    <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 mb-5">
        {troupeUserObject.troupeName}
    </h1>
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {leaders.map((leader) => (
        <li
          key={leader.user.email}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-8">
            <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full object-cover" src={leader.user.photo} alt="" />
            <h3 className="mt-6 text-sm font-medium text-gray-900">{leader.user.name}</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Role</dt>
              <dd className="mt-3">
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  {leader.userTypeName}
                </span>
              </dd>
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
                  href={`#`}
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
            <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full object-cover" src={performer.user.photo} alt="" />
            <h3 className="mt-6 text-sm font-medium text-gray-900">{performer.user.name}</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Role</dt>
              <dd className="mt-3">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {performer.userTypeName}
                </span>
              </dd>
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
                  href={`#`}
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

  )
}


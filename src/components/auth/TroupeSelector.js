import { useEffect, useState, Fragment } from "react"
import { useNavigate } from "react-router-dom"
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import mainLogo from'../images/chair.jpg'

export const TroupeSelector = () => {

    const [troupes, setTroupes] = useState([])
    const [selectedTroupe, setSelectedTroupe] = useState(null)
    const troupeUser = localStorage.getItem("troupe_user")
    const troupeUserObject = JSON.parse(troupeUser)
    const userTroupes = troupeUserObject.troupes
    const navigate = useNavigate()

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    useEffect(() => {
        const fetchTroupes = async () => {
            const response = await fetch('http://localhost:8088/troupes')
            const troupesArray = await response.json()
            const userTroupesArray = []
            for (const troupe of troupesArray) {
                for (const userTroupe of userTroupes) {
                    if (userTroupe.troupeId === troupe.id) {
                        userTroupesArray.push({
                            id: userTroupe.troupeId,
                            userTroupeId: userTroupe.id,
                            name: troupe.name,
                            isLeader: userTroupe.isLeader,
                            logo: troupe.logo
                        })
                    }
                }
            }
            setTroupes(userTroupesArray)
        }
        fetchTroupes()
    }, [])

    const setLocalStorage = (event) => {

        event.preventDefault()

        localStorage.setItem(
            "troupe_user",
            JSON.stringify({
                userId: troupeUserObject.id,
                userTroupeId: selectedTroupe.userTroupeId,
                userPhoto: troupeUserObject.userPhoto,
                troupeLeader: selectedTroupe.isLeader,
                troupeId: selectedTroupe.id,
                troupeName: selectedTroupe.name
            })
        )
        navigate("/")
    }

    return <>

<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src={mainLogo}
            alt="Your Company"
          />
          

        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6">
              <div>

<Listbox value={selectedTroupe} onChange={setSelectedTroupe}>
                {({ open }) => (
                    <>
                        <Listbox.Label className="block text-sm font-medium text-gray-700">select your troupe</Listbox.Label>
                        <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                <span className="flex items-center">
                                    <img src={selectedTroupe?.logo} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                    <span className="ml-3 block truncate">{selectedTroupe?.name}</span>
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
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
                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {troupes.map((troupe) => (
                                        <Listbox.Option
                                            key={troupe.id}
                                            className={({ active }) =>
                                                classNames(
                                                    active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                )
                                            }
                                            value={troupe}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <div className="flex items-center">
                                                        <img src={troupe.logo} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                                        <span
                                                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                        >
                                                            {troupe.name}
                                                        </span>
                                                    </div>

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
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={(clickEvent) => setLocalStorage(clickEvent)}
                >
                  Sign in
                </button>
              </div>
            </form>
              
              
            </div>
          </div>
        </div>

    </>
}
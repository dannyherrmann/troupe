import { Fragment, useState, useEffect } from 'react'
import { Disclosure, Menu, Transition, Listbox } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import mainLogo from'../images/chair.jpg'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'
import { UpcomingEvents } from '../events/UpcomingEvents'
import { Dialog } from '@headlessui/react'
import { LinkIcon, PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { format } from 'date-fns'
import {
  ArchiveBoxIcon,
  ArrowRightCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  HeartIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/20/solid'

export const HomeDashboard = () => {

    const [open, setOpen] = useState(false)
    const [eventTypes, setEventTypes] = useState([])
    const [events, setEvents] = useState([]);
    const [selectedEventType, setSelectedEventType] = useState({id: 1, name: "Show"})
    const [newEventDateTime, setEventDateTime] = useState({
      startDateTime: '',
      endDateTime: ''
    })
    const [newStartDateTime, setNewStartDateTime] = useState('')
    const [newEndDateTime, setNewEndDateTime] = useState('')
    const troupeUser = localStorage.getItem("troupe_user")
    const troupeUserObject = JSON.parse(troupeUser)
    const navigate = useNavigate()

    const fetchEvents = async () => {
      const response = await fetch(
        `http://localhost:8088/events?troupeId=${troupeUserObject.troupeId}&_expand=eventType`
      );
      const eventArray = await response.json();
      setEvents(eventArray);
    };
  
    useEffect(() => {
      fetchEvents();
    }, []);

    const formatEventDateTime = (eventDateTime) => {
      const convertDateTime = new Date(eventDateTime);
  
      return format(
        convertDateTime,
        "LLLL do, yyyy '('h:mm a"
      );
    };

    const formatEndTime = (eventDateTime) => {
      const convertDateTime = new Date(eventDateTime);
  
      return format(
        convertDateTime,
        "h:mm a')'"
      );
    }

    const handleSaveButtonClick = (event) => {
      event.preventDefault();
  
      // TODO: Create the object to be saved to the API
  
      const newEvent = {
        eventTypeId: selectedEventType.id,
        startDateTime: newStartDateTime,
        endDateTime: newEndDateTime,
        troupeId: troupeUserObject.troupeId
      };
      console.log(`newEvent`,newEvent)
  
      // TODO: Perform the fetch() to POST the object to the API
  
      const sendData = async () => {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEvent),
        };
        const response = await fetch(`http://localhost:8088/events`, options);
        await response.json();
        fetchEvents()
        setOpen(false)
      };
      sendData();
      setSelectedEventType({id: 1, name: "Show"})
      setNewStartDateTime('')
      setNewEndDateTime('')
    };

    useEffect(() => {
      const fetchEventTypes = async () => {
        const response = await fetch(`http://localhost:8088/eventTypes`);
        const eventTypesArray = await response.json();
        setEventTypes(eventTypesArray);
      };
      fetchEventTypes();
    }, []);
    
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
      }

      const deleteButton = (eventId, active) => {
        return (
          <a
          href="#"
          className={classNames(
            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
            'group flex items-center px-4 py-2 text-sm'
          )}
          onClick={() => {
            const deleteEvent = async () => {
              const options = {
                method: "DELETE",
              };
              await fetch(`http://localhost:8088/events/${eventId}`, options);
              fetchEvents();
            };
            deleteEvent();
          }}
        >
          <TrashIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
          Delete
        </a>
        );
      };


     
    const user = {
        name: 'Tom Cook',
        email: 'tom@example.com',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      }
      const navigation = [
        { name: 'Dashboard', href: '#', current: true },
        { name: 'Troupe', href: '#', current: false },
        { name: 'Calendar', href: '#', current: false }
      ]
      const userNavigation = [
        { name: 'Your Profile', href: '#' },
        { name: 'Settings', href: '#' },
        { name: 'Sign out', href: '#' },
      ]

      const people = [
        {
          name: 'Jane Cooper',
          title: 'Regional Paradigm Technician',
          role: 'Admin',
          email: 'janecooper@example.com',
          telephone: '+1-202-555-0170',
          imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
        },
        // More people...
      ]

      const plans = [
        {
          id: 1,
          name: 'Hobby',
          memory: '4 GB RAM',
          cpu: '4 CPUs',
          storage: '128 GB SSD disk',
          price: '$40',
          isCurrent: false,
        },
        {
          id: 2,
          name: 'Startup',
          memory: '8 GB RAM',
          cpu: '6 CPUs',
          storage: '256 GB SSD disk',
          price: '$80',
          isCurrent: true,
        },
        // More plans...
      ]


return (
    <>
    <div className="min-h-full">
<Disclosure as="nav" className="border-b border-gray-200 bg-white">
  {({ open }) => (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="block h-8 w-auto lg:hidden"
                src={mainLogo}
                alt="Your Company"
              />
              <img
                className="hidden h-8 w-auto lg:block"
                src={mainLogo}
                alt="Your Company"
              />
            </div>
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              type="button"
              className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="sr-only">Open user menu</span>
                  <img className="h-8 w-8 rounded-full" src={troupeUserObject.userPhoto} alt="" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item key={"logOut"}>
                               {({ active }) => (
                                <a 
                                href=""
                                className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                  onClick={() => {
                                      localStorage.removeItem("troupe_user")
                                      navigate("/", {replace: true})
                                  }}
                                >Sign out</a>
                               )}
                            </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span className="sr-only">Open main menu</span>
              {open ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </Disclosure.Button>
          </div>
        </div>
      </div>

      <Disclosure.Panel className="sm:hidden">
        <div className="space-y-1 pt-2 pb-3">
          {navigation.map((item) => (
            <Disclosure.Button
              key={item.name}
              as="a"
              href={item.href}
              className={classNames(
                item.current
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              {item.name}
            </Disclosure.Button>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4 pb-3">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">{user.name}</div>
              <div className="text-sm font-medium text-gray-500">{user.email}</div>
            </div>
            <button
              type="button"
              className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 space-y-1">
            {userNavigation.map((item) => (
              <Disclosure.Button
                key={item.name}
                as="a"
                href={item.href}
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                {item.name}
              </Disclosure.Button>
            ))}
          </div>
        </div>
      </Disclosure.Panel>
    </>
  )}
</Disclosure>

<div className="py-10">
  <header>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">{troupeUserObject.troupeName}</h1>
    </div>
  </header>
  <main>
    
  <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Replace with your content */}
      <div className="px-4 py-8 sm:px-0">
        <div className="h-96 rounded-lg border-4 border-dashed border-gray-200">

        <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 mt-5">Upcoming Events</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        {troupeUserObject.troupeLeader ? (
            <>
            <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            onClick={() => {setOpen(true)}}
          >
            New Event
          </button>
            </>
        ) : (
            <></>
        )}
        </div>
      </div>
      <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Event Type
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Date / Time
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                My Availability
              </th>

              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>

            </tr>
          </thead>
          <tbody>
            {events.map((event, eventIdx) => (
              <tr key={event.id}>
                <td
                  className={classNames(
                    eventIdx === 0 ? '' : 'border-t border-transparent',
                    'relative py-4 pl-4 sm:pl-6 pr-3 text-sm'
                  )}
                >
                  <div className="font-medium text-gray-900">
                    {event.eventType.name}
                    {event.isCurrent ? <span className="ml-1 text-indigo-600">(Current Plan)</span> : null}
                  </div>
                  {eventIdx !== 0 ? <div className="absolute right-0 left-6 -top-px h-px bg-gray-200" /> : null}
                </td>
                <td
                  className={classNames(
                    eventIdx === 0 ? '' : 'border-t border-gray-200',
                    'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
                  )}
                >
                  {`${formatEventDateTime(event.startDateTime)} - ${formatEndTime(event.endDateTime)}`}
                </td>
                <td
                  className={classNames(
                    eventIdx === 0 ? '' : 'border-t border-gray-200',
                    'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
                  )}
                > 
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-5 py-2 mr-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                    
                  >
                    Yes<span className="sr-only">, {event.eventType.name}</span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-5 py-2 mr-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                    
                  >
                    No<span className="sr-only">, {event.eventType.name}</span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                    
                  >
                    Maybe<span className="sr-only">, {event.eventType.name}</span>
                  </button>
                </td>
                <td
                  className={classNames(
                    eventIdx === 0 ? '' : 'border-t border-gray-200',
                    'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
                  )}
                >
                  
                  <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          Actions
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {
              troupeUserObject.troupeLeader ? (
                <>
                <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <PencilSquareIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Edit
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                deleteButton(event.id, active)
              )}
            </Menu.Item>
                </>
              ) : (
                <>
                
                </>
              )
            }
          

          </div>
        </Menu.Items>
      </Transition>
    </Menu>

                </td>


    
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

        </div>
      </div>
      {/* /End replace */}
    </div>

  </main>

  <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="bg-gray-50 px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between space-x-3">
                          <div className="space-y-1">
                            <Dialog.Title className="text-lg font-medium text-gray-900">New event</Dialog.Title>
                            <p className="text-sm text-gray-500">
                              Get started by filling in the information below to create your new event.
                            </p>
                          </div>
                          <div className="flex h-7 items-center">
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Divider container */}
                      <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                        {/* Event Type */}
                        <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="project-name"
                              className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                            >
                              Event Type
                            </label>
                          </div>
                          <div className="sm:col-span-2">

                          <Listbox value={selectedEventType} onChange={setSelectedEventType}>
      {({ open }) => (
        <>
        
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <span className="block truncate">{selectedEventType?.name}</span>
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
                {eventTypes.map((eventType) => (
                  <Listbox.Option
                    key={eventType.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={eventType}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {eventType.name}
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
                        </div>

                        {/* Start Date */}
                        <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="start-date"
                              className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                            >
                              Start Date
                            </label>
                          </div>
                          <div className="sm:col-span-2">

                          <input
                              type="datetime-local"
                              name="start-date"
                              id="start-date"
                              value={newStartDateTime}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
                              onChange={(event) => {
                                setNewStartDateTime(event.target.value);
                              }}
                            />

                          </div>
                        </div>

                        {/* End Date */}
                        <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="end-date"
                              className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                            >
                              End Date
                            </label>
                          </div>
                          <div className="sm:col-span-2">

                          <input
                              type="datetime-local"
                              name="end-date"
                              id="end-date"
                              value={newEndDateTime}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
                              onChange={(event) => {
                                setNewEndDateTime(event.target.value);
                              }}
                            />

                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          onClick={(clickEvent) => handleSaveButtonClick(clickEvent)}
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

</div>
</div>
    </>
)

       

}
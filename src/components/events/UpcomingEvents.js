import { useEffect, useState } from "react";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
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

export const UpcomingEvents = ({ setterFunction, events }) => {

    const troupeUser = localStorage.getItem("troupe_user")
    const troupeUserObject = JSON.parse(troupeUser)
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
      }

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
            onClick={() => {setterFunction(true)}}
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
            {events2.map((event, eventIdx) => (
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
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <DocumentDuplicateIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Duplicate
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <ArchiveBoxIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Archive
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <ArrowRightCircleIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Move
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <UserPlusIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Share
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <HeartIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Add to favorites
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <TrashIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Delete
                </a>
              )}
            </Menu.Item>
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
    )
}
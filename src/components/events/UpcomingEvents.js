import { format } from "date-fns";
import {
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
  ClipboardDocumentCheckIcon
} from "@heroicons/react/20/solid";
import {
  Menu,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { DeleteAvailability, GetUserEventAvailability, AddAvailability, FetchEventResponses, FetchTroupeUsers, PatchAvailability } from "../ApiManager";
import { StarIcon } from "@heroicons/react/24/outline";

export const UpcomingEvents = ({fetchEvents, setOpenNewEvent, events, setEditEventId, setOpenEditEvent, setEditEventData, setEditSelectedEventType, setDeleteEventId, setDeleteAlert, setViewResponses, setEventResponses, setCastShow}) => {

  const troupeUser = localStorage.getItem("troupe_user");
  const troupeUserObject = JSON.parse(troupeUser);

  const handleAvailabilityClick = event => {

    const buttonClicked = event.currentTarget.firstChild.data

    const eventId = parseInt(event.currentTarget.id); 

    const updateAvailability = async () => {

      const availability = await GetUserEventAvailability(troupeUserObject.userTroupeId, eventId)

      const newAvailability = {
        userTroupeId: troupeUserObject.userTroupeId,
        eventId: eventId,
        response: buttonClicked
      }
      
      if (availability.length === 0) {
        await AddAvailability(newAvailability)
        fetchEvents()
      } else if ((availability.length > 0) & (availability[0].response != buttonClicked)) {
        await PatchAvailability(availability[0].id, {"response": buttonClicked})
        fetchEvents()
      } else if ((availability.length > 0) & (availability[0].response === buttonClicked)) {
        await DeleteAvailability(availability[0].id)
        fetchEvents()
      }
  }
  updateAvailability()
};

  // classNames for tailwindUI components
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  // date-fns format functions
  const formatEventDateTime = (eventDateTime) => {
    const convertDateTime = new Date(eventDateTime);

    return format(convertDateTime, "LLLL do, yyyy '('h:mm a");
  };

  const formatEndTime = (eventDateTime) => {
    const convertDateTime = new Date(eventDateTime);

    return format(convertDateTime, "h:mm a')'");
  };

  // function to create the edit action option - called when creating upcoming events table
  const EditButton = (eventId, active) => {
    return (
      <a 
        href="#"
        eventid={eventId}
        className={classNames(
          active ? "bg-gray-100 text-gray-900" : "text-gray-700",
          "group flex items-center px-4 py-2 text-sm"
        )}
        onClick={(event) => {
          setEditEventId(event.currentTarget.getAttribute('eventid'))
          console.log(event.currentTarget.getAttribute('eventid'))
          const fetchEvent = async () => {
            const response = await fetch(
              `http://localhost:8088/events?id=${eventId}&_expand=eventType`
            );
            const event = await response.json();
            setEditEventData(event[0]);
            setEditSelectedEventType({
              id: event[0].eventType.id,
              name: event[0].eventType.name,
            });
            setOpenEditEvent(true);
          };
          fetchEvent();
        }}
>
  <PencilSquareIcon
    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
    aria-hidden="true"
  />
  Edit Event
</a>
    )
  }

  // function to create the delete action option - called when creating upcoming events table
  const deleteButtonConfirm = (eventId, active) => {
    setDeleteEventId(eventId);
    return (
      <a
        href="#"
        className={classNames(
          active ? "bg-gray-100 text-gray-900" : "text-gray-700",
          "group flex items-center px-4 py-2 text-sm"
        )}
        onClick={() => {
          setDeleteAlert(true);
        }}
      >
        <TrashIcon
          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
        Delete Event
      </a>
    );
  };

  const viewResponses = (eventId, active) => {
    return (
          <a 
           href="#"
           eventid={eventId}
           className={classNames(
             active ? "bg-gray-100 text-gray-900" : "text-gray-700",
             "group flex items-center px-4 py-2 text-sm"
           )}
           onClick={(event) => {

             const eventClicked = event.currentTarget.getAttribute('eventid')

             const fetchEventResponses = async () => {
              const eventResponseData = await FetchEventResponses(eventClicked)
              const troupeUsers = await FetchTroupeUsers(troupeUserObject.troupeId)
              const eventResponses = { ...eventResponseData[0] }
              const newAvailabilityArray = []
              for (const availability of eventResponses.availability) {
                const newAvailability = { ...availability }
                for (const user of troupeUsers) {
                  if (user.id === availability.userTroupeId) {
                    newAvailability.name = user.user.name
                    newAvailability.photo = user.user.photo
                  }
                }
                for (const cast of eventResponses.eventCast) {
                  if (cast.userTroupeId === availability.userTroupeId) {
                    newAvailability.isCasted = true
                  }
                }
                newAvailabilityArray.push(newAvailability)
                newAvailabilityArray.sort(function (a, b) {
                  if (b.response < a.response) {
                    return -1;
                  }
                  if (b.response > a. response) {
                    return 1
                  }
                  return 0
                })
              }
              eventResponses.availability = newAvailabilityArray
              setEventResponses(eventResponses)
              setViewResponses(true)
             }
          fetchEventResponses()
          }}
          >
             <ClipboardDocumentCheckIcon
               className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
               aria-hidden="true"
             />
             View Responses
          </a>
    )
  }

  const viewResponsesButton = (eventId, casted, active) => {
    return (
          <button 
           eventid={eventId}
           className={classNames(
             active ? " text-gray-900" : "text-gray-700",
             "group flex items-center px-4 py-2 text-sm "
           )}
           onClick={(event) => {

             const eventClicked = event.currentTarget.getAttribute('eventid')

             const fetchEventResponses = async () => {
              const eventResponseData = await FetchEventResponses(eventClicked)
              const troupeUsers = await FetchTroupeUsers(troupeUserObject.troupeId)
              const eventResponses = { ...eventResponseData[0] }
              const newAvailabilityArray = []
              for (const availability of eventResponses.availability) {
                const newAvailability = { ...availability }
                for (const user of troupeUsers) {
                  if (user.id === availability.userTroupeId) {
                    newAvailability.name = user.user.name
                    newAvailability.photo = user.user.photo
                  }
                }
                for (const cast of eventResponses.eventCast) {
                  if (cast.userTroupeId === availability.userTroupeId) {
                    newAvailability.isCasted = true
                  }
                }
                newAvailabilityArray.push(newAvailability)
                newAvailabilityArray.sort(function (a, b) {
                  if (b.response < a.response) {
                    return -1;
                  }
                  if (b.response > a. response) {
                    return 1
                  }
                  return 0
                })
              }
              eventResponses.availability = newAvailabilityArray
              setEventResponses(eventResponses)
              setViewResponses(true)
             }
          fetchEventResponses()
          }}
          >
          {
            casted ? (
              <>
              <StarIcon
               className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
               aria-hidden="true"
             />
             View Cast
              </>
            ) : (
              <>
              <ClipboardDocumentCheckIcon
               className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
               aria-hidden="true"
             />
             View Responses
              </>
            )
          }
          </button>
          
    )
  }

  const fetchAndShowEventResponses = async (eventId) => {
    const eventResponseData = await FetchEventResponses(eventId)
    const troupeUsers = await FetchTroupeUsers(troupeUserObject.troupeId)
    const eventResponses = { ...eventResponseData[0] }
    const newAvailabilityArray = []
    for (const availability of eventResponses.availability) {
      const newAvailability = { ...availability }
      for (const user of troupeUsers) {
        if (user.id === availability.userTroupeId) {
          newAvailability.name = user.user.name
          newAvailability.photo = user.user.photo
        }
      }
      for (const cast of eventResponses.eventCast) {
        if (cast.userTroupeId === availability.userTroupeId) {
          newAvailability.isCasted = true
        }
      }
      newAvailabilityArray.push(newAvailability)
      newAvailabilityArray.sort(function (a, b) {
        if (b.response < a.response) {
          return -1;
        }
        if (b.response > a. response) {
          return 1
        }
        return 0
      })
    }
    eventResponses.availability = newAvailabilityArray
    setEventResponses(eventResponses)
    setCastShow(true)
  }

  const castShow = (eventId, active) => {
    return (
          <a 
           href="#"
           eventid={eventId}
           className={classNames(
             active ? "bg-gray-100 text-gray-900" : "text-gray-700",
             "group flex items-center px-4 py-2 text-sm"
           )}
           onClick={(event) => {
             const eventClicked = event.currentTarget.getAttribute('eventid')
             fetchAndShowEventResponses(eventClicked)
          }}
          >
             <StarIcon
               className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
               aria-hidden="true"
             />
            Cast Show
          </a>
    )
  }

  return (
    <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              {/* Replace with your content */}
              <div className="px-4 py-8 sm:px-0">
                <div className="h-700 rounded-lg border-4 border-dashed border-gray-300 pb-7">
                  <div className="px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                      <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900 mt-5">
                          Upcoming Events
                        </h1>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        {troupeUserObject.troupeLeader ? (
                          <>
                            <button
                              type="button"
                              className="mt-5 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                              onClick={() => {
                                setOpenNewEvent(true);
                              }}
                            >
                              New Event
                            </button>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:-mx-6 md:mx-0 md:rounded-lg bg-white">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Event Type
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                            >
                              Date / Time
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                            >
                              My Availability
                            </th>

                            <th
                              scope="col"
                              className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                            >
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.map((event, eventIdx) => (
                            <tr id={event.id} key={event.id} className="flex-row flex-wrap">
                              <td
                                className={classNames(
                                  eventIdx === 0
                                    ? ""
                                    : "border-t border-transparent",
                                  "relative py-4 pl-4 sm:pl-6 pr-3 text-sm"
                                )}
                              >
                                <div className="font-medium text-gray-900">
                                  {event.eventType.name}
                                  {event.isCurrent ? (
                                    <span className="ml-1 text-indigo-600">
                                      (Current Plan)
                                    </span>
                                  ) : null}
                                </div>
                                {eventIdx !== 0 ? (
                                  <div className="absolute right-0 left-6 -top-px h-px bg-gray-200" />
                                ) : null}
                              </td>
                              <td
                                className={classNames(
                                  eventIdx === 0
                                    ? ""
                                    : "border-t border-gray-200",
                                  "hid1 px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                                )}
                              >
                                {`${formatEventDateTime(
                                  event.startDateTime
                                )} - ${formatEndTime(event.endDateTime)}`}
                              </td>
                              <td
                                className={classNames(
                                  eventIdx === 0
                                    ? ""
                                    : "border-t border-gray-200",
                                  "px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                                )}
                              >
                                {
                                  event.userResponse === "Yes" ? (
                                    <>
                                      <button
                                        id={event.id}
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-gray-300 bg-green-500 px-5 py-2 mr-2 text-sm font-medium leading-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                                        onClick={handleAvailabilityClick}
                                      >
                                        Yes
                                        <span className="sr-only">
                                          , {event.eventType.name}
                                        </span>
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        id={event.id}
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-5 py-2 mr-2 text-sm font-medium leading-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                                        onClick={handleAvailabilityClick}
                                      >
                                        Yes
                                        <span className="sr-only">
                                          , {event.eventType.name}
                                        </span>
                                      </button>
                                    </>
                                  )
                                }
                                {
                                  event.userResponse === "No" ? (
                                    <>
                                        <button
                                          id={event.id}
                                          type="button"
                                          onClick={handleAvailabilityClick}
                                          className="inline-flex items-center rounded-md border border-gray-300 bg-red-500 px-5 py-2 mr-2 text-sm font-medium leading-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                          No
                                          <span className="sr-only">
                                            , {event.eventType.name}
                                          </span>
                                        </button>
                                    </>
                                  ) : (
                                    <>
                                        <button
                                          id={event.id}
                                          onClick={handleAvailabilityClick}
                                          type="button"
                                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-5 py-2 mr-2 text-sm font-medium leading-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                          No
                                          <span className="sr-only">
                                            , {event.eventType.name}
                                          </span>
                                        </button>
                                    </>
                                  )
                                }
                                {
                                  event.userResponse === "Maybe" ? (
                                    <>
                                        <button
                                          id={event.id}
                                          onClick={handleAvailabilityClick}
                                          type="button"
                                          className="inline-flex items-center rounded-md border border-gray-300 bg-yellow-400 px-3 py-2 mr-2 text-sm font-medium leading-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                          Maybe
                                          <span className="sr-only">
                                            , {event.eventType.name}
                                          </span>
                                        </button>
                                    </>
                                  ) : (
                                    <>
                                        <button
                                          id={event.id}
                                          onClick={handleAvailabilityClick}
                                          type="button"
                                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 mr-2 text-sm font-medium leading-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                          Maybe
                                          <span className="sr-only">
                                            , {event.eventType.name}
                                          </span>
                                        </button>
                                    </>
                                  )
                                }
                              </td>
                              <td
                                className={classNames(
                                  eventIdx === 0
                                    ? ""
                                    : "border-t border-gray-200",
                                  "px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                                )}
                              >
                                {troupeUserObject.troupeLeader ? (

                                
                                <Menu
                                  as="div"
                                  className="relative inline-block text-left"
                                >
                                  <div>
                                    <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                      Actions
                                      <ChevronDownIcon
                                        className="-mr-1 ml-2 h-5 w-5"
                                        aria-hidden="true"
                                      />
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
                                        {event.eventType.name === "Show" ? (
                                          <>
                                            <Menu.Item>
                                              {({ active }) =>
                                                EditButton(event.id)
                                              }
                                            </Menu.Item>
                                            <Menu.Item>
                                              {({ active }) =>
                                                deleteButtonConfirm(event.id)
                                              }
                                            </Menu.Item>
                                            <Menu.Item>
                                              {({ active }) => 
                                                castShow(event.id)
                                              }
                                            </Menu.Item>
                                          </>
                                        ) : (
                                          <>
                                            <Menu.Item>
                                              {({ active }) =>
                                                EditButton(event.id)
                                              }
                                            </Menu.Item>
                                            <Menu.Item>
                                              {({ active }) =>
                                                deleteButtonConfirm(event.id)
                                              }
                                            </Menu.Item>
                                            <Menu.Item>
                                              {({ active }) => 
                                                viewResponses(event.id)   
                                              }
                                            </Menu.Item>
                                          </>
                                        )}
                                      </div>
                                    </Menu.Items>
                                  </Transition>
                                </Menu>) : (
                                  <>
                                  {
                                    viewResponsesButton(event.id, event.casted)
                                  }
                                  </>
                                )}
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
  )
}
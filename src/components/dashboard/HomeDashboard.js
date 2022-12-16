import { Fragment, useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Disclosure,
  Menu,
  Transition,
  Listbox,
  Dialog,
  RadioGroup
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import mainLogo from "../images/chair.jpg";
import { CheckIcon, ChevronUpDownIcon, EllipsisVerticalIcon, QuestionMarkCircleIcon, CheckCircleIcon, StarIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { UpcomingEvents } from "../events/UpcomingEvents";
import { FetchTroupeEvents, FetchEventTypes, AddCastMember, FetchEventResponses, FetchTroupeUsers, GetCastedUser, DeleteCastedUser } from "../ApiManager";

export const HomeDashboard = () => {
  // open new event side panel
  const [openNewEvent, setOpenNewEvent] = useState(false);
  // open edit event side panel
  const [openEditEvent, setOpenEditEvent] = useState(false);
  // holds the event ID when leader clicks edit action
  const [editEventId, setEditEventId] = useState("");
  // open the delete alert modal window
  const [deleteAlert, setDeleteAlert] = useState(false);
  // holds the event ID when leader clicks delete action
  const [deleteEventId, setDeleteEventId] = useState("");
  // holds all event types from json-server
  const [eventTypes, setEventTypes] = useState([]);
  // holds all troupe events from json-server
  const [events, setEvents] = useState([]);
  // event type state for a new event
  const [selectedEventType, setSelectedEventType] = useState({
    id: 1,
    name: "Show",
  });
  // event type state for an edited event
  const [editSelectedEventType, setEditSelectedEventType] = useState({});
  // holds state of a new start date time
  const [newStartDateTime, setNewStartDateTime] = useState("");
  // holds state of a new end date time
  const [newEndDateTime, setNewEndDateTime] = useState("");
  // holds state of an edited event
  const [editEventData, setEditEventData] = useState({
    eventTypeId: "",
    startDateTime: "",
    endDateTime: "",
  });
  const [openViewResponses, setViewResponses] = useState(false)
  const [eventResponses, setEventResponses] = useState([])
  const [openCastShow, setCastShow] = useState(false)
  const mailingLists = [


    { id: 1, title: 'Newsletter', description: 'Last message sent an hour ago', users: '621 users' },
    { id: 2, title: 'Existing Customers', description: 'Last message sent 2 weeks ago', users: '1200 users' },
    { id: 3, title: 'Trial Users', description: 'Last message sent 4 days ago', users: '2740 users' },
  ]
  const [selectedMailingLists, setSelectedMailingLists] = useState("")
  const [showCast, setShowCast] = useState([])
  const troupeUser = localStorage.getItem("troupe_user");
  const troupeUserObject = JSON.parse(troupeUser);
  const navigate = useNavigate();
  // classNames for tailwindUI components
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  // navigation constants from tailwindUI doc
  const navigation = [
    { name: "Dashboard", href: "#", current: true },
    { name: "Troupe", href: "#", current: false },
    { name: "Calendar", href: "#", current: false },
  ];

  const userNavigation = [
    { name: "Your Profile", href: "#" },
    { name: "Settings", href: "#" },
    { name: "Sign out", href: "#" },
  ];
  


  const FetchEventsWithUserResponse = async () => {

    const today = formatToday(new Date())
    const eventArray = await FetchTroupeEvents(today)

    const userEventAvailability = []
    for (const event of eventArray) {
      const copy = { ...event }
      for (const availability of event.availability) {
        if (troupeUserObject.userTroupeId === availability.userTroupeId) {
          copy.userResponse = availability.response
        }
      }
      userEventAvailability.push(copy)
    }
  setEvents(userEventAvailability)
}

  // this useEffect fetches initial state of user troupe ID events
  useEffect(() => {
    FetchEventsWithUserResponse()
  }, []);

  useEffect(() => {
    FetchEventTypes(setEventTypes);
  }, []);

  // when user selects an updated event type this will update the editEventData.eventTypeId state with newly selected event type
  useEffect(() => {
    editEventData.eventTypeId = editSelectedEventType.id;
  }, [editSelectedEventType]);

  // create new event function - called with create event panel
  const createNewEvent = (event) => {
    event.preventDefault();

    const newEvent = {
      eventTypeId: selectedEventType.id,
      startDateTime: newStartDateTime,
      endDateTime: newEndDateTime,
      troupeId: troupeUserObject.troupeId,
    };
    console.log(`newEvent`, newEvent);

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
      FetchEventsWithUserResponse()
      setOpenNewEvent(false);
    };
    sendData();
    setSelectedEventType({ id: 1, name: "Show" });
    setNewStartDateTime("");
    setNewEndDateTime("");
  };

  // function to save edited event data to json-server/API - called within edit event side panel i.e. Save Event
  const editEvent = (event) => {
    event.preventDefault();

    const updatedEvent = {
      eventTypeId: editEventData.eventTypeId,
      startDateTime: editEventData.startDateTime,
      endDateTime: editEventData.endDateTime,
      troupeId: troupeUserObject.troupeId,
    };

    const saveEvent = async () => {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      };
      const response = await fetch(
        `http://localhost:8088/events/${editEventId}`,
        options
      );
      await response.json();
      FetchEventsWithUserResponse()
      setOpenEditEvent(false);
    };
    saveEvent();
  };

  const tabs = [


    { name: 'Responses', href: '#', current: true }

  ]

    // date-fns format functions
    const formatEventDateTime = (eventDateTime) => {
      const convertDateTime = new Date(eventDateTime);
  
      return format(convertDateTime, "M/d/y");
    };
  
    const formatEndTime = (eventDateTime) => {
      const convertDateTime = new Date(eventDateTime);
  
      return format(convertDateTime, "h:mm a");
    };

    const formatToday = (date) => {
      return format(date, "y-MM-dd'T'H':00'")
    }

    const fetchEventResponsesAgain = async (eventId) => {
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
    }

  const handleCastClick = (availability) => {

    const userClicked = availability.userTroupeId
    const eventId = availability.eventId

    const addNewCastMember = async () => {

      const castedUser = await GetCastedUser(userClicked, eventId)
      
      const newCastMember = {
        eventId: availability.eventId,
        userTroupeId: availability.userTroupeId
      }

      if (castedUser.length === 0) {
        await AddCastMember(newCastMember)
        fetchEventResponsesAgain(newCastMember.eventId)
      } else if (castedUser.length > 0) {
        await DeleteCastedUser(castedUser[0].id)
        fetchEventResponsesAgain(castedUser[0].eventId)
      }

    }
    addNewCastMember()
  }



  return (
    <>
      {/* STACKED LAYOUT DASHBOARD */}
      <div className="min-h-full">
        
      
        
        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                {troupeUserObject.troupeName}
              </h1>
            </div>
          </header>
          
       <UpcomingEvents 
           setOpenNewEvent={setOpenNewEvent} 
           events={events}
           setEditEventId={setEditEventId}
           setOpenEditEvent={setOpenEditEvent}
           setEditEventData={setEditEventData}
           setEditSelectedEventType={setEditSelectedEventType}
           setDeleteEventId={setDeleteEventId}
           setDeleteAlert={setDeleteAlert}
           fetchEvents={FetchEventsWithUserResponse}
           setViewResponses={setViewResponses}
           setEventResponses={setEventResponses}
           setCastShow={setCastShow}/>

          {/* CREATE NEW EVENT SIDE PANEL */}
          <Transition.Root show={openNewEvent} as={Fragment}>
          <Dialog
          as="div"
          className="relative z-10"
          onClose={setOpenNewEvent}>
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
                    <Dialog.Title className="text-lg font-medium text-gray-900">
                      New event
                    </Dialog.Title>
                    <p className="text-sm text-gray-500">
                      Get started by filling in the information
                      below to create your new event.
                    </p>
                  </div>
                  <div className="flex h-7 items-center">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setOpenNewEvent(false)}
                    >
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
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
                    <Listbox
                      value={selectedEventType}
                      onChange={setSelectedEventType}
                    >
                      {({ open }) => (
                        <>
                          <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                              <span className="block truncate">
                                {selectedEventType?.name}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
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
                                        active
                                          ? "text-white bg-indigo-600"
                                          : "text-gray-900",
                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                      )
                                    }
                                    value={eventType}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={classNames(
                                            selected
                                              ? "font-semibold"
                                              : "font-normal",
                                            "block truncate"
                                          )}
                                        >
                                          {eventType.name}
                                        </span>

                                        {selected ? (
                                          <span
                                            className={classNames(
                                              active
                                                ? "text-white"
                                                : "text-indigo-600",
                                              "absolute inset-y-0 right-0 flex items-center pr-4"
                                            )}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
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
                  onClick={() => setOpenNewEvent(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(clickEvent) =>
                    createNewEvent(clickEvent)
                  }
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

          {/* DELETE EVENT MODAL WINDOW */}
          <Transition.Root show={deleteAlert} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setDeleteAlert}>
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
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon
                            className="h-6 w-6 text-red-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                          >
                            Delete Event
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to delete this event?
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={() => {
                            const deleteEvent = async () => {
                              console.log(`delete event ID -->`, deleteEventId);
                              const options = {
                                method: "DELETE",
                              };
                              await fetch(
                                `http://localhost:8088/events/${deleteEventId}`,
                                options
                              );
                              FetchEventsWithUserResponse()
                              setDeleteAlert(false);
                            };
                            deleteEvent();
                          }}
                        >
                          Delete Event
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                          onClick={() => setDeleteAlert(false)}
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

          {/* EDIT EVENT SIDE PANEL */}
          <Transition.Root show={openEditEvent} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              onClose={setOpenEditEvent}
            >
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
                                  <Dialog.Title className="text-lg font-medium text-gray-900">
                                    Edit event
                                  </Dialog.Title>
                                  <p className="text-sm text-gray-500">
                                    You can edit event details below
                                  </p>
                                </div>
                                <div className="flex h-7 items-center">
                                  <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-500"
                                    onClick={() => setOpenEditEvent(false)}
                                  >
                                    <span className="sr-only">Close panel</span>
                                    <XMarkIcon
                                      className="h-6 w-6"
                                      aria-hidden="true"
                                    />
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
                                  <Listbox
                                    value={editSelectedEventType}
                                    onChange={setEditSelectedEventType}
                                  >
                                    {({ open }) => (
                                      <>
                                        <div className="relative mt-1">
                                          <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                            <span className="block truncate">
                                              {editSelectedEventType.name}
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                              <ChevronUpDownIcon
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                              />
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
                                                      active
                                                        ? "text-white bg-indigo-600"
                                                        : "text-gray-900",
                                                      "relative cursor-default select-none py-2 pl-3 pr-9"
                                                    )
                                                  }
                                                  value={eventType}
                                                >
                                                  {({ selected, active }) => (
                                                    <>
                                                      <span
                                                        className={classNames(
                                                          selected
                                                            ? "font-semibold"
                                                            : "font-normal",
                                                          "block truncate"
                                                        )}
                                                      >
                                                        {eventType.name}
                                                      </span>

                                                      {selected ? (
                                                        <span
                                                          className={classNames(
                                                            active
                                                              ? "text-white"
                                                              : "text-indigo-600",
                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                          )}
                                                        >
                                                          <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                          />
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
                                    value={editEventData.startDateTime}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
                                    onChange={(event) => {
                                      const copy = { ...editEventData };
                                      copy.startDateTime = event.target.value;
                                      setEditEventData(copy);
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
                                    value={editEventData.endDateTime}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
                                    onChange={(event) => {
                                      const copy = { ...editEventData };
                                      copy.endDateTime = event.target.value;
                                      setEditEventData(copy);
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
                                onClick={() => setOpenEditEvent(false)}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                onClick={(clickEvent) => editEvent(clickEvent)}
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              >
                                Save Event
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

          {/* VIEW RESPONSES SIDE PANEL */}
          <Transition.Root show={openViewResponses} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setViewResponses}>
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">{eventResponses.eventType?.name} on {eventResponses.startDateTime ? (<>{formatEventDateTime(eventResponses.startDateTime)}</>):(<></>)}</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                            onClick={() => setViewResponses(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-gray-200">
                      <div className="px-6">
                        <nav className="-mb-px flex space-x-6" x-descriptions="Tab component">
                          {tabs.map((tab) => (
                            <a
                              key={tab.name}
                              href={tab.href}
                              className={classNames(
                                tab.current
                                  ? 'border-indigo-500 text-indigo-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm'
                              )}
                            >
                              {tab.name}
                            </a>
                          ))}
                        </nav>
                      </div>
                    </div>
                    <RadioGroup value={selectedMailingLists} onChange={setSelectedMailingLists}>
                          <div className="m-4">
                            {
                              eventResponses.availability?.map((availability) => (
                                
                                availability.isCasted ? (
                                  <>
                                    <RadioGroup.Option
                                      id={availability.userTroupeId}
                                      key={availability.userTroupeId}
                                      value={availability.userTroupeId}
                                      className="border-transparent relative flex rounded-lg border bg-gray-100 p-4 m-4 shadow-sm focus:outline-none">
                                      <span className="relative flex min-w-0 flex-1 items-center">
                                        <span className="relative inline-block flex-shrink-0">
                                          <img className="h-10 w-10 rounded-full" src={availability.photo} alt="" />
                                        </span>
                                        <div className="ml-4 truncate">
                                        <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                                          {availability.name} is casted!
                                        </RadioGroup.Label>
                                        {/* <RadioGroup.Description as="span" className="mt-1 flex items-center text-sm text-gray-500">
                                          Responded {availability.response}
                                        </RadioGroup.Description> */}
                                        </div>
                                        </span>
                                        <StarIcon
                                        className="h-5 w-5 text-yellow-400"
                                        />
                                        <span
                                        className="border-2 border-indigo-500 pointer-events-none absolute -inset-px rounded-lg"
                                        />
                                    </RadioGroup.Option>
                                  </>
                                ) : (
                                  <>
                                    <RadioGroup.Option
                                      key={availability.userTroupeId}
                                      value={availability.userTroupeId}
                                      className="border-gray-300 relative flex rounded-lg border bg-white p-4 m-4 shadow-sm focus:outline-none">
                                      
                                      <span className="relative flex min-w-0 flex-1 items-center">
                    
                                        
                                        <span className="relative inline-block flex-shrink-0">
                                          <img className="h-10 w-10 rounded-full" src={availability.photo} alt="" />
                                        </span>
                                        <div className="ml-4 truncate">
                                        <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                                          {availability.name}
                                        </RadioGroup.Label>
                                        {/* <RadioGroup.Description as="span" className="mt-1 flex items-center text-sm text-gray-500">
                                          {availability.response}
                                        </RadioGroup.Description> */}
                                        </div>
                                    </span>
                                    {
                                      availability.response === "Yes" ? (
                                        <>
                                        <CheckCircleIcon 
                                        className="h-5 w-5 text-green-500"
                                        />
                                        <span className="border-2 border-green-500 pointer-events-none absolute -inset-px rounded-lg" />
                                        </>
                                      ) : availability.response === "No" ? (
                                        <>
                                        <XCircleIcon 
                                        className="h-5 w-5 text-red-500"
                                        />
                                        <span className="border-2 border-red-500 pointer-events-none absolute -inset-px rounded-lg" />
                                        </>
                                      ) : (
                                        <>
                                        <QuestionMarkCircleIcon 
                                        className="h-5 w-5 text-yellow-400"
                                        />
                                        <span className="border-2 border-yellow-400 pointer-events-none absolute -inset-px rounded-lg" />
                                        </>
                                      )
                                    }
                                    </RadioGroup.Option>
                                  </>
                                )
                              ))
                            }
                            </div>
                            </RadioGroup>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>


    {/* CAST SHOW SIDE PANEL */}
    <Transition.Root show={openCastShow} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setCastShow}>
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">{eventResponses.eventType?.name} on {eventResponses.startDateTime ? (<>{formatEventDateTime(eventResponses.startDateTime)}</>):(<></>)}</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                            onClick={() => setCastShow(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-gray-200">
                      <div className="px-6">
                        <nav className="-mb-px flex space-x-6" x-descriptions="Tab component">
                          {tabs.map((tab) => (
                            <a
                              key={tab.name}
                              href={tab.href}
                              className={classNames(
                                tab.current
                                  ? 'border-indigo-500 text-indigo-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm'
                              )}
                            >
                              {tab.name}
                            </a>
                          ))}
                        </nav>
                      </div>
                    </div>
                    <RadioGroup value={selectedMailingLists} onChange={setSelectedMailingLists}>
                          <div className="m-4">
                            {
                              eventResponses.availability?.map((availability) => (
                                
                                availability.isCasted ? (
                                  <>
                                    <RadioGroup.Option
                                      id={availability.userTroupeId}
                                      key={availability.userTroupeId}
                                      value={availability.userTroupeId}
                                      className="border-transparent relative flex cursor-pointer rounded-lg border bg-gray-100 p-4 m-4 shadow-sm focus:outline-none"
                                      onClick={() => {
                                        if (troupeUserObject.troupeLeader === true) {
                                          handleCastClick(availability)
                                        }
                                      }}>
                                      <span className="relative flex min-w-0 flex-1 items-center">
                                        <span className="relative inline-block flex-shrink-0">
                                          <img className="h-10 w-10 rounded-full" src={availability.photo} alt="" />
                                        </span>
                                        <div className="ml-4 truncate">
                                        <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                                          {availability.name} is casted!
                                        </RadioGroup.Label>
                                        {/* <RadioGroup.Description as="span" className="mt-1 flex items-center text-sm text-gray-500">
                                          Responded {availability.response}
                                        </RadioGroup.Description> */}
                                        </div>
                                        </span>
                                        <StarIcon
                                        className="h-5 w-5 text-yellow-400"
                                        />
                                        <span
                                        className="border-2 border-indigo-500 pointer-events-none absolute -inset-px rounded-lg"
                                        />
                                    </RadioGroup.Option>
                                  </>
                                ) : (
                                  <>
                                    <RadioGroup.Option
                                      key={availability.userTroupeId}
                                      value={availability.userTroupeId}
                                      className="border-gray-300 relative flex cursor-pointer rounded-lg border bg-white p-4 m-4 shadow-sm focus:outline-none"
                                      onClick={() => {
                                        if (troupeUserObject.troupeLeader === true) {
                                          handleCastClick(availability)
                                        }
                                      }}>
                                      
                                      <span className="relative flex min-w-0 flex-1 items-center">
                    
                                        
                                        <span className="relative inline-block flex-shrink-0">
                                          <img className="h-10 w-10 rounded-full" src={availability.photo} alt="" />
                                        </span>
                                        <div className="ml-4 truncate">
                                        <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                                          {availability.name}
                                        </RadioGroup.Label>
                                        {/* <RadioGroup.Description as="span" className="mt-1 flex items-center text-sm text-gray-500">
                                          {availability.response}
                                        </RadioGroup.Description> */}
                                        </div>
                                    </span>
                                    {
                                      availability.response === "Yes" ? (
                                        <>
                                        <CheckCircleIcon 
                                        className="h-5 w-5 text-green-500"
                                        />
                                        <span className="border-2 border-green-500 pointer-events-none absolute -inset-px rounded-lg" />
                                        </>
                                      ) : availability.response === "No" ? (
                                        <>
                                        <XCircleIcon 
                                        className="h-5 w-5 text-red-500"
                                        />
                                        <span className="border-2 border-red-500 pointer-events-none absolute -inset-px rounded-lg" />
                                        </>
                                      ) : (
                                        <>
                                        <QuestionMarkCircleIcon 
                                        className="h-5 w-5 text-yellow-400"
                                        />
                                        <span className="border-2 border-yellow-400 pointer-events-none absolute -inset-px rounded-lg" />
                                        </>
                                      )
                                    }
                                    </RadioGroup.Option>
                                  </>
                                )
                              ))
                            }
                            </div>
                            </RadioGroup>
                  </div>
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
  );
};

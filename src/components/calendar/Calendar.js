import { Fragment, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { eachDayOfInterval, endOfMonth, format, startOfMonth, startOfToday, endOfWeek, isToday, isSameMonth, isEqual, parse, add, startOfWeek, isSameDay, parseISO } from "date-fns";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const Calendar = () => {

const meetings = [
  {
    id: 1,
    name: 'Leslie Alexander',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    start: '1:00 PM',
    startDatetime: '2022-12-29T13:00',
    end: '2:30 PM',
    endDatetime: '2022-12-29T14:30',
  },
  // More meetings...
]


const today = startOfToday()

const [selectedDay, setSelectedDay] = useState(today)
const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

const days = eachDayOfInterval({
  start: startOfWeek(firstDayCurrentMonth),
  end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
})

const previousMonth = () => {
  let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
  setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
}

const nextMonth = () => {
  let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
  setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
}

let selectedDayMeetings = meetings.filter((meeting) => 
  isSameDay(parseISO(meeting.startDatetime), selectedDay)
)

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 py-10">
    <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
      <div className="md:pr-14">
        <div className="flex items-center">
          <h2 className="flex-auto font-semibold text-gray-900">
            {/* January 2022 */}
            {format(firstDayCurrentMonth, 'MMMM yyyy')}
            </h2>
          <button
            type="button"
            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            onClick={previousMonth}
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            onClick={nextMonth}
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className="mt-2 grid grid-cols-7 text-sm">
          {days.map((day, dayIdx) => (
            <div key={day.toString()} className={classNames(dayIdx > 6 && 'border-t border-gray-200', 'py-1.5')}>
              <button
                type="button"
                onClick={() => setSelectedDay(day)}
                className={classNames(
                  isEqual(day, selectedDay) && 'text-white',
                  !isEqual(day, selectedDay) && isToday(day) && 'text-indigo-600',
                  !isEqual(day, selectedDay) && !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && 'text-gray-900',
                  !isEqual(day, selectedDay) && !isToday(day) && !isSameMonth(day, firstDayCurrentMonth) && 'text-gray-400',
                  isEqual(day, selectedDay) && isToday(day) && 'bg-indigo-600',
                  isEqual(day, selectedDay) && !isToday(day) && 'bg-gray-900',
                  !isEqual(day, selectedDay) && 'hover:bg-gray-300',
                  (day.isSelected || isToday(day)) && 'font-semibold',
                  'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                )}
              >
                <time dateTime={format(day, 'yyyy-MM-dd')}>
                  {format(day, 'd')}
                </time>
              </button>
              <div className="w-1 h-1 mx-auto mt-1">
                  {meetings.some((meeting) => 
                    isSameDay(parseISO(meeting.startDatetime), day)
                  ) && (
                    <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <section className="mt-12 md:mt-0 md:pl-14">
        <h2 className="font-semibold text-gray-900">
          Schedule for <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>{format(selectedDay, 'MMM dd, yyy')}</time>
        </h2>
        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
          {selectedDayMeetings.length > 0 ? (
            selectedDayMeetings.map((meeting) => (
                <Meeting meeting={meeting} key={meeting.id}/>
            ))
          ) : (
            <p>No meetings for today</p>
          )}
        </ol>
      </section>
    </div>
    </div>
  )
}

function Meeting({ meeting }) {

  return (
    <li
    key={meeting.id}
    className="group flex items-center space-x-4 rounded-xl py-2 px-4 focus-within:bg-gray-100 hover:bg-gray-100"
  >
    <img src={meeting.imageUrl} alt="" className="h-10 w-10 flex-none rounded-full" />
    <div className="flex-auto">
      <p className="text-gray-900">{meeting.name}</p>
      {/* <p className="mt-0.5">
        <time dateTime={meeting.startDatetime}>{meeting.start}</time> -{' '}
        <time dateTime={meeting.endDatetime}>{meeting.end}</time>
      </p> */}
    </div>
    <Menu as="div" className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100">
      <div>
        <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
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
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Cancel
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  </li>
  )
}


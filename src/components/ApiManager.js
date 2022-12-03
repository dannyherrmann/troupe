export const FetchTroupeEvents = async () => {

const troupeUser = localStorage.getItem("troupe_user");
const troupeUserObject = JSON.parse(troupeUser);

  const response = await fetch(
    `http://localhost:8088/events?troupeId=${troupeUserObject.troupeId}&_expand=eventType&_sort=startDateTime&_embed=availability`
  );
  const eventArray = await response.json();
  return eventArray
};

export const FetchEventTypes = async (state) => {
  const response = await fetch(`http://localhost:8088/eventTypes`);
  const eventTypesArray = await response.json();
  state(eventTypesArray)
};

export const GetUserEventAvailability = async (userTroupeId, eventId) => {
  const response = await fetch(
    `http://localhost:8088/availability?userTroupeId=${userTroupeId}&eventId=${eventId}`
  );
  const availability = await response.json();
  return availability
}

export const DeleteAvailability = async (userAvailabilityId) => {
  const options = {
    method: "DELETE",
  };
  await fetch(
    `http://localhost:8088/availability/${userAvailabilityId}`,
    options
  );
}

export const AddAvailability = async (availability) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(availability),
  };
  const response = await fetch(`http://localhost:8088/availability`, options);
  await response.json();
}
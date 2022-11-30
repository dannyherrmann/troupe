

export const FetchTroupeEvents = async (state) => {

  const troupeUser = localStorage.getItem("troupe_user");
const troupeUserObject = JSON.parse(troupeUser);

  const response = await fetch(
    `http://localhost:8088/events?troupeId=${troupeUserObject.troupeId}&_expand=eventType&_embed=availability`
  );
  const eventArray = await response.json();
  state(eventArray)
};

export const FetchEventTypes = async (state) => {
  const response = await fetch(`http://localhost:8088/eventTypes`);
  const eventTypesArray = await response.json();
  state(eventTypesArray)
};

export const FetchUserAvailability = async (state) => {

  const troupeUser = localStorage.getItem("troupe_user");
const troupeUserObject = JSON.parse(troupeUser);

  const response = await fetch(`http://localhost:8088/availability?_expand=event&userTroupeId=${troupeUserObject.userTroupeId}`)
  const availabilityArray = await response.json()
  state(availabilityArray)
}
export const FetchTroupeEvents = async (state) => {

  const troupeUser = localStorage.getItem("troupe_user");
  const troupeUserObject = JSON.parse(troupeUser);

  const response = await fetch(
    `http://localhost:8088/events?troupeId=${troupeUserObject.troupeId}&_expand=eventType&_embed=availability`
  );
  const eventArray = await response.json();
  state(eventArray)
};

export const FetchEventTypes = async () => {
  const response = await fetch(`http://localhost:8088/eventTypes`);
  const eventTypesArray = await response.json();
  return eventTypesArray
};
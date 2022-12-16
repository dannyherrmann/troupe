export const FetchTroupeEvents = async (today) => {

const troupeUser = localStorage.getItem("troupe_user");
const troupeUserObject = JSON.parse(troupeUser);

  const response = await fetch(
    `http://localhost:8088/events?troupeId=${troupeUserObject.troupeId}&_expand=eventType&_sort=startDateTime&_embed=availability&startDateTime_gte=${today}&_embed=eventCast`
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

export const PatchAvailability = async (userAvailabilityId, newResponse) => {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newResponse),
  };
  const response = await fetch(`http://localhost:8088/availability/${userAvailabilityId}`, options)
  await response.json()
}

export const FetchEventResponses = async (eventId) => {
    const response = await fetch(
      `http://localhost:8088/events?id=${eventId}&_expand=eventType&_sort=startDateTime&_embed=availability&_embed=eventCast`
    );
    const eventResponses = await response.json();
    return eventResponses
}

export const FetchTroupeUsers = async (troupeId) => {
  const response = await fetch(`http://localhost:8088/userTroupes?troupeId=${troupeId}&_expand=user`)
  const troupeUsers = await response.json()
  return troupeUsers
}

export const AddCastMember = async (castMember) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(castMember),
  };
  const response = await fetch(`http://localhost:8088/eventCast`, options);
  await response.json();
}

export const GetCastedUser = async (userTroupeId, eventId) => {
  const response = await fetch(
    `http://localhost:8088/eventCast?userTroupeId=${userTroupeId}&eventId=${eventId}`
  );
  const availability = await response.json();
  return availability
}

export const DeleteCastedUser = async (eventCastId) => {
  const options = {
    method: "DELETE",
  };
  await fetch(
    `http://localhost:8088/eventCast/${eventCastId}`,
    options
  );
}

export const FetchUserTypes = async () => {
  const response = await fetch(`http://localhost:8088/userTypes`)
  const userTypes = await response.json()
  return userTypes
}
export const FetchTroupeEvents = async (today) => {

const troupeUser = localStorage.getItem("troupe_user");
const troupeUserObject = JSON.parse(troupeUser);

  const response = await fetch(
    `http://troupe-db.glitch.me/events?troupeId=${troupeUserObject.troupeId}&_expand=eventType&_sort=startDateTime&_embed=availability&startDateTime_gte=${today}&_embed=eventCast`
  );
  const eventArray = await response.json();
  return eventArray
};

export const FetchEventTypes = async (state) => {
  const response = await fetch(`http://troupe-db.glitch.me/eventTypes`);
  const eventTypesArray = await response.json();
  state(eventTypesArray)
};

export const GetUserEventAvailability = async (userTroupeId, eventId) => {
  const response = await fetch(
    `http://troupe-db.glitch.me/availability?userTroupeId=${userTroupeId}&eventId=${eventId}`
  );
  const availability = await response.json();
  return availability
}

export const DeleteAvailability = async (userAvailabilityId) => {
  const options = {
    method: "DELETE",
  };
  await fetch(
    `http://troupe-db.glitch.me/availability/${userAvailabilityId}`,
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
  const response = await fetch(`http://troupe-db.glitch.me/availability`, options);
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
  const response = await fetch(`http://troupe-db.glitch.me/availability/${userAvailabilityId}`, options)
  await response.json()
}

export const FetchEventResponses = async (eventId) => {
    const response = await fetch(
      `http://troupe-db.glitch.me/events?id=${eventId}&_expand=eventType&_sort=startDateTime&_embed=availability&_embed=eventCast`
    );
    const eventResponses = await response.json();
    return eventResponses
}

export const FetchTroupeUsers = async (troupeId) => {
  const response = await fetch(`http://troupe-db.glitch.me/userTroupes?troupeId=${troupeId}&_expand=user`)
  const troupeUsers = await response.json()
  return troupeUsers
}

export const FetchUsers = async () => {
  const response = await fetch(`http://troupe-db.glitch.me/users`)
  const users = await response.json()
  return users
}

export const AddCastMember = async (castMember) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(castMember),
  };
  const response = await fetch(`http://troupe-db.glitch.me/eventCast`, options);
  await response.json();
}

export const GetCastedUser = async (userTroupeId, eventId) => {
  const response = await fetch(
    `http://troupe-db.glitch.me/eventCast?userTroupeId=${userTroupeId}&eventId=${eventId}`
  );
  const availability = await response.json();
  return availability
}

export const DeleteCastedUser = async (eventCastId) => {
  const options = {
    method: "DELETE",
  };
  await fetch(
    `http://troupe-db.glitch.me/eventCast/${eventCastId}`,
    options
  );
}

export const FetchUserTypes = async () => {
  const response = await fetch(`http://troupe-db.glitch.me/userTypes`)
  const userTypes = await response.json()
  return userTypes
}

export const FetchLoggedInUser = async (userId) => {
  const response = await fetch(`http://troupe-db.glitch.me/users/${userId}`)
  const user = await response.json()
  return user
}

export const UpdateUserPhoto = async (userId, photoUrl) => {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(photoUrl),
  };
  const response = await fetch(`http://troupe-db.glitch.me/users/${userId}`, options)
  await response.json()
}

export const PatchUser = async (userId, updates) => {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  };
  const response = await fetch(`http://troupe-db.glitch.me/users/${userId}`, options);
  await response.json();
}

export const GetUserTroupe = async (troupeId) => {
  const response = await fetch(
    `http://troupe-db.glitch.me/troupes/${troupeId}`
  );
  const troupe = await response.json();
  return troupe
}

export const AddNewUser = async (newUser) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  };
  const user = await fetch(`http://troupe-db.glitch.me/users`, options);
  const newUserResponse = await user.json();
  return newUserResponse
}

export const AddUserTroupe = async (newUserTroupe) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUserTroupe),
  };
  const userTroupe = await fetch(`http://troupe-db.glitch.me/userTroupes`, options);
  await userTroupe.json();
}


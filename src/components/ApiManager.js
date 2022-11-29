

export const FetchEvents = async () => {

    const troupeUser = localStorage.getItem("troupe_user")
    const troupeUserObject = JSON.parse(troupeUser)

    const response = await fetch(
      `http://localhost:8088/events?troupeId=${troupeUserObject.troupeId}&_expand=eventType`
    );
    return await response.json();
    
  };
export const ApplicationViews = () => {
  // const localProjectUser = localStorage.getItem("capstone_user");
  // const projectUserObject = JSON.parse(localProjectUser);

  const troupeUser = localStorage.getItem("troupe_user")
  const troupeUserObject = JSON.parse(troupeUser)

  return (
    <h1>Welcome to {troupeUserObject.troupeName}!!</h1>
  );
};

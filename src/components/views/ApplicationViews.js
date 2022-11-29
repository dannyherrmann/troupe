import { LeaderViews } from "./LeaderViews";
import { PerformerViews } from "./PerformerViews";

export const ApplicationViews = () => {
  // const localProjectUser = localStorage.getItem("capstone_user");
  // const projectUserObject = JSON.parse(localProjectUser);

  const troupeUser = localStorage.getItem("troupe_user")
  const troupeUserObject = JSON.parse(troupeUser)

  if (troupeUserObject.troupeLeader) {
    return <LeaderViews />
  } else {
    return <PerformerViews />
  }
};

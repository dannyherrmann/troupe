import { Navigate, useLocation } from "react-router-dom";

export const Authorized = ({ children }) => {
  const location = useLocation();

  // Need to provide a Troupe selection page if user is in multiple Troupes.
  // 1. see if email inputted into login page matches email in users table COMPLETE
  // 2. instead of returning children here I need to return a "troupe selector" component
  if (localStorage.getItem("troupe_user")) {
    return children;
  } else {
    return (
      <Navigate to={`/login/${location.search}`} replace state={{ location }} />
    );
  }
};

import { Route, Routes } from "react-router-dom";
import { Authorized } from "./views/Authorized";
import { ApplicationViews } from "./views/ApplicationViews";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { TroupeSelector } from "./auth/TroupeSelector";

export const Troupe = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/selectTroupe" element={<TroupeSelector />} />

      <Route
        path="*"
        element={
          <Authorized>
            <>
              <ApplicationViews />
            </>
          </Authorized>
        }
      />
    </Routes>
  );
};

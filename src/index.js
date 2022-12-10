import { Troupe } from "./components/Troupe";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import firebase from "firebase/compat/app"
import { firebaseConfig } from "./apiKeys";

firebase.initializeApp(firebaseConfig)

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Troupe />
  </BrowserRouter>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { FirebaseContext } from "./context/FirebaseContext";
import Context from "./context/FirebaseContext.tsx";
import { auth, db } from "./firebase/config";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FirebaseContext.Provider value={{ auth, db }}>
      <Context>
        <App />
      </Context>
    </FirebaseContext.Provider>
  </React.StrictMode>
);

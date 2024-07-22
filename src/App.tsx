import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Create from "./Components/Create/Create";
import View from "./Pages/ViewPost";
import { AuthContext, FirebaseContext } from "./context/FirebaseContext";
import Post from "./context/PostContext";
import LoadingRoute from "./Components/Loader/LoadingRoute"; 
import "./App.css";


function App() {
  const authContext = useContext(AuthContext);
  const firebaseContext = useContext(FirebaseContext);

  useEffect(() => {
    if (authContext && firebaseContext) {
      const { auth } = firebaseContext;
      const { setUser } = authContext;

      const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
      });

      // Clean up subscription on unmount
      return () => unsubscribe();
    }
  }, [authContext, firebaseContext]);

  return (
    <Post>
      <Router>
        <LoadingRoute>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<Create />} />
            <Route path="/view" element={<View />} />
          </Routes>
        </LoadingRoute>
      </Router>
    </Post>
  );
}

export default App;

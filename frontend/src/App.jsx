import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import "./App.css";
import { Signup } from "./components/SignUp";
import { Signin } from "./components/SignIn";
import { Home } from "./components/Home"; // Import Signin component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

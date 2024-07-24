import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleSubmit() {
    fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage("User created successfully");
        // Navigate to Signin page after successful signup
        setTimeout(() => {
          navigate("/signin");
        }, 1000); // Delay navigation to allow the user to see the message
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("Error creating user");
      });
  }

  return (
    <>
      <input
        placeholder="Username..."
        onChange={(e) => setUsername(e.target.value)}
        type="text"
      />
      <input
        placeholder="Password..."
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <button onClick={handleSubmit}>Submit</button>
      {message && <p>{message}</p>}
    </>
  );
}

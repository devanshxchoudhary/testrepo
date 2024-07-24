import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";

export function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleSubmit() {
    fetch("http://localhost:3000/signin", {
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
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          setMessage("Signed in successfully");
          navigate("/home");
        } else {
          setMessage("Failed to sign in");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("Error during sign in");
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
      <button onClick={handleSubmit}>Sign In</button>
      {message && <p>{message}</p>}
    </>
  );
}

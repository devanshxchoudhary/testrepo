import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Add styling if needed

export function Home() {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await fetch("http://localhost:3000/data", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUsername(data.name);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="home">
      <h1 style={{ color: "black" }}>Welcome, {username}!</h1>
    </div>
  );
}

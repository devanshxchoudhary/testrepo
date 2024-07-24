const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { User } = require("./db");
const { checkifExists } = require("./middlewares");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", checkifExists, async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = await User.create({
      username: username,
      password: password,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    console.log("Signin request data:", req.body);

    const user = await User.findOne({ username: username, password: password });
    console.log("User found:", user);

    if (user) {
      const token = jwt.sign({ username }, "dev", {
        expiresIn: "1h",
      });
      console.log("Token generated:", token);
      res.json({ token });
    } else {
      console.log("User not found or incorrect password");
      res.status(401).json({ message: "Authentication Failed" });
    }
  } catch (err) {
    console.error("Error during sign-in:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/data", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "dev", (err, data) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    res.json({ name: data.username });
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

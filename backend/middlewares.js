const { User } = require("./db");

const checkifExists = async function checkifExists(req, res, next) {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) {
      return res.status(411).json({ msg: "User already exists" });
    }

    next();
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  checkifExists,
};

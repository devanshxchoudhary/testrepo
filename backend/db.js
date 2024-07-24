const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://devanshchoudhary:mongo123@cluster0.mibwmtl.mongodb.net/auth"
);
const UserSchema = mongoose.Schema(
  {
    username: String,
    password: String,
  },
  { collection: "User" }
);

const User = mongoose.model("User", UserSchema);
module.exports = {
  User,
};

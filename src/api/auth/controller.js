const User = require("../user/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
 const { email, username, password } = req.body;

 const existingUser = await User.findOne({
  $or: [{ username }, { email }],
 });

 if (existingUser) {
  return res.status(409).json({
   message: existingUser.email === email ? "Email already exists" : "Username already exists",
  });
 }

 try {
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = (
   await User.create({
    email,
    username,
    password: hashedPassword,
   })
  ).toObject();

  const accessToken = jwt.sign(
   {
    email: newUser.email,
    username: newUser.username,
   },
   process.env.ACCESS_TOKEN_SECRET,
   { expiresIn: "8d" },
  );

  const refreshToken = jwt.sign(
   {
    email: newUser.email,
    username: newUser.username,
   },
   process.env.REFRESH_TOKEN_SECRET,
   { expiresIn: "7d" },
  );

  res.cookie("jwt", refreshToken, {
   httpOnly: true,
   secure: true,
   sameSite: "None",
   maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  delete newUser.password;

  res.status(201).json({
   success: true,
   data: { token: accessToken, sessionUser: newUser },
   message: "User created successfully",
  });
 } catch (error) {
  console.log(error);
  res.status(500).json({ message: "Internal server error", error });
 }
};

const login = async (req, res) => {
 const { email, username, password } = req.body;

 let foundUser = await User.findOne({
  $or: [{ username }, { email }],
 });

 if (!foundUser || !foundUser.active) {
  return res.status(401).json({ message: "No user found with the given credentials" });
 }

 foundUser = foundUser.toObject();

 const match = await bcrypt.compare(password, foundUser.password);

 if (!match) return res.status(401).json({ message: "Unauthorized" });

 const accessToken = jwt.sign(
  {
   email: foundUser.email,
   username: foundUser.username,
  },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: "8d" },
 );

 const refreshToken = jwt.sign(
  {
   email: foundUser.email,
   username: foundUser.username,
  },
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: "7d" },
 );

 res.cookie("jwt", refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 7 * 24 * 60 * 60 * 1000,
 });

 delete foundUser.password;

 res.status(200).json({
  success: true,
  data: { token: accessToken, sessionUser: foundUser },
  message: "Logged in successfully",
 });
};

const refreshAccessToken = (req, res) => {
 const cookies = req.cookies;

 if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

 const refreshToken = cookies.jwt;

 jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
  if (err) return res.status(403).json({ message: "Forbidden" });

  const foundUser = await User.findOne({ username: decoded.username });

  if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

  const accessToken = jwt.sign(
   {
    email: foundUser.email,
    username: foundUser.username,
   },
   process.env.ACCESS_TOKEN_SECRET,
   { expiresIn: "8d" },
  );

  res.status(200).json({ success: true, data: accessToken, message: "Token refreshed successfully" });
 });
};

const logout = (req, res) => {
 const cookies = req.cookies;

 if (!cookies?.jwt) return res.sendStatus(204);

 res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

 res.status(200).json({ success: true, data: null, message: "Logged out successfully" });
};

module.exports = {
 signup,
 login,
 refreshAccessToken,
 logout,
};

const User = require("./model");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
 const users = await User.find().select("-password");
 if (!users.length) {
  return res.status(400).json({ success: false, message: "No users found", data: null });
 }
 res.status(200).json({ success: true, message: "Users retrieved successfully", data: users });
};

const createNewUser = async (req, res) => {
 const { email, username, password } = req.body;

 const duplicateEmail = await User.findOne({ email }).collation({ locale: "en", strength: 2 });
 const duplicateUsername = await User.findOne({ username }).collation({ locale: "en", strength: 2 });

 if (duplicateEmail)
  return res.status(409).json({ success: false, message: "Email is already in use", data: null });
 if (duplicateUsername)
  return res.status(409).json({ success: false, message: "Username is already taken", data: null });

 const hashedPwd = await bcrypt.hash(password, 10);
 const user = await User.create({ email, username, password: hashedPwd });

 res.status(201).json({ success: true, message: `New user ${username} created`, data: user });
};

const updateUser = async (req, res) => {
 const { userId } = req.params;
 const { email, username, active, password } = req.body;

 const user = await User.findById(userId);
 if (!user) return res.status(404).json({ success: false, message: "User not found", data: null });

 const duplicateEmail = email ? await User.findOne({ email }).collation({ locale: "en", strength: 2 }) : null;

 const duplicateUsername = username
  ? await User.findOne({ username }).collation({ locale: "en", strength: 2 })
  : null;

 if (duplicateEmail && duplicateEmail._id.toString() !== userId) {
  return res.status(409).json({ success: false, message: "Email is already in use", data: null });
 }

 if (duplicateUsername && duplicateUsername._id.toString() !== userId) {
  return res.status(409).json({ success: false, message: "Username is already taken", data: null });
 }

 user.email = email || user.email;
 user.username = username || user.username;
 user.active = active ?? user.active;

 if (password) {
  user.password = await bcrypt.hash(password, 10);
 }

 await user.save();
 res.status(200).json({ success: true, message: `${user.username} updated`, data: user });
};

const deleteUser = async (req, res) => {
 const { userId } = req.params;

 const user = await User.findById(userId);
 if (!user) return res.status(404).json({ success: false, message: "User not found", data: null });

 await user.deleteOne();
 res.status(200).json({ success: true, message: `User ${user.username} deleted`, data: null });
};

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };

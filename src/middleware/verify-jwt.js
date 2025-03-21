const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
 const authHeader = req.headers.authorization || req.headers.Authorization;

 if (!authHeader?.startsWith("Bearer ")) {
  return res
   .status(401)
   .json({ success: false, data: null, message: "You are not authorized to perform this action" });
 }

 const token = authHeader.split(" ")[1];

 jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
  if (err)
   return res
    .status(403)
    .json({ success: false, data: null, message: "You are not authorized to perform this action" });

  const user = {};
  user.email = decoded.email;
  user.username = decoded.username;
  req.user = user;
  next();
 });
};

module.exports = verifyJwt;

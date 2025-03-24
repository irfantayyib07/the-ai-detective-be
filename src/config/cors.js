exports.corsConfig = {
 origin: function (origin, callback) {
  const allowedOrigins = [
   "https://the-ai-detective-fe.vercel.app",
   "http://localhost:3000",
   "http://localhost:5173",
  ];
  if (!origin || allowedOrigins.indexOf(origin) !== -1) {
   callback(null, origin);
  } else {
   callback(new Error("Not allowed by CORS"));
  }
 },
 credentials: true,
 methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
 allowedHeaders: ["Content-Type", "Authorization"],
};

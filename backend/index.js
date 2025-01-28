const express = require("express");
const engRouter = require("./engRouter");
const sweRouter = require("./sweRouter");
const docRouter = require("./docRouter");
const app = express();
const path = require("path");
const cors = require("cors");
require('dotenv').config();
const PORT = 3080;
app.disable('x-powered-by');
app.set('etag', false);
app.use(express.json());

// Access key for the API 
let accessKey = null
if(process.env.RUN_ON_CLOUD === 'true') {
  accessKey = process.env.ACCESS_KEY.trim();
}

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://language-learning-app-1.onrender.com',
      'http://localhost:3080',
      'http://localhost:5173'
    ];

    // Check if the origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the origin
    } else {
      callback(new Error('Not allowed by CORS')); // Deny the origin
    }
  },
  allowedHeaders: ['Content-Type', 'Authorization', 'Application/json'], // Specify allowed headers
  credentials: true 
}));

function authenticate(req, res, next) {
  const key = req.headers.authorization || req.body.key;
  const allowedMethods = ['GET'];

  // Everyone can read the data
  if (allowedMethods.includes(req.method)) {
    return next();
  }

  if (key && key.trim() === accessKey || process.env.RUN_ON_CLOUD === 'false') {
    return next();
  } else {
    res.status(401).json({ message: "Access denied: Invalid or missing key" });
  }
}

app.use("/api/languages/english", authenticate, engRouter);
app.use("/api/languages/swedish", authenticate, sweRouter);
app.use("/api/manual", docRouter);
app.use(express.static(path.join(__dirname, "public")));

app.get("/api", (req, res) => {
  res.send("Hello this is root of the api");
});
app.get("/api/languages", (req, res) => {
  res.send("This is the languages root of the api");
});

app.post("/api/login", (req, res) => { 
  const { key } = req.body;
  if(accessKey === key || process.env.RUN_ON_CLOUD === 'false') {
    res.status(200).json({ message: "Access granted" });
  } else {
    res.status(401).json({ message: "Access denied" });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

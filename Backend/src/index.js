import express, { json, urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import "./config/passportConfig.js";

import MongoStore from "connect-mongo";


dotenv.config();

dbConnect();

console.log("Hello World");
const app = express();
app.use(express.json());

// Middleware
// const corsOptions = {
//   origin: ["http://localhost:3001"],
//   credentials: true,
// };


// app.use(cors(corsOptions));
// app.use(cors());
// const corsOptions = {
//   origin: 'https://multi-factor-auth-frontend.onrender.com', // Specify exact frontend origin
//   credentials: true, // Important for handling credentials
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
// };

const corsOptions = {
  origin: [
    'https://multi-factor-auth-frontend.onrender.com', // Deployed frontend
    'http://localhost:3001', // Local development
  ],
  credentials: true, // To allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions));



app.use(cors(corsOptions));
app.use(json({ limit: "100mb" }));
app.use(urlencoded({ limit: "100mb", extended: true }));
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 1000 * 60 * 60,
//     },
//   })
// );

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.CONNECTION_STRING, // MongoDB connection string
    }),
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true, // Helps protect against XSS
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);

// Listen app
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

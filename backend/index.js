import express from "express";
import mongoose from "mongoose";
import ticketR from "./routes/ticketR.js";
import cors from "cors";
import loginR from "./routes/loginR.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import chatbotRoute from "./routes/ChatbotR.js";
import path from "path"; 
import { PORT, mongoDBURL, SESSION_SECRET } from "./config.js";

const app = express();

app.use(express.json());

// Middleware for handling CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], 
    credentials: true,
  })
);

// Session middleware configuration
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: mongoDBURL }),
    cookie: {
      secure: false, 
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'))); 

// Routes
app.use("/ticket", ticketR);
app.use("/", loginR);
app.use("/chatbot", chatbotRoute);

// Database connection
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });

app.get("/user", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json("Not authenticated");
  }
});

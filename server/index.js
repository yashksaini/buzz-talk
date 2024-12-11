import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Connection } from "./database/db.js";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import Routes from "./routes/routes.js";
import { getActiveUsers, initializeSocket } from "./socket/socket.js";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const app = express();
const httpServer = createServer(app);
initializeSocket(httpServer);

const PORT = 3000;
dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const URL = `mongodb+srv://${username}:${password}@buzz-talk.cawopel.mongodb.net/?retryWrites=true&w=majority`;
Connection(username, password);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Trust the first proxy in the chain
app.set("trust proxy", 1);
// To initialize CORS
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
app.use(
  session({
    secret: "asdfefna",
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({ mongoUrl: URL }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
      httpOnly: true,
      secure: false, // For development; set to true in production (requires HTTPS)
      // sameSite: false,
    },
  })
);

app.use("/", Routes);

app.get("/active-users", (req, res) => {
  res.json(getActiveUsers());
});
// app.use(express.static(join(__dirname, "public")));
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

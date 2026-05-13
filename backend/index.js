import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import db from "./config/database.js";
import globalRoutes from "./routes/global.route.js";
import path from "path";

const PORT = process.env.PORT || 5000;
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", globalRoutes);

db.authenticate()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on Port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

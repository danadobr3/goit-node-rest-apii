import express from "express";
import morgan from "morgan";
import cors from "cors";
import * as path from "node:path";
import "dotenv/config";

import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import validateToken from "./helpers/validateToken.js";
import "./db.js";

export const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", validateToken, contactsRouter);
app.use("/api/users", usersRouter);
app.use("/", express.static(path.join(process.cwd(), "public")));

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
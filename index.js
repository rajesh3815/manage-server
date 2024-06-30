const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routers/auth.routes");
const assigneRouter = require("./routers/assigne.routes");
const todoRouter = require("./routers/todo.routes");
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/people", assigneRouter);
app.use("/api/v1/todo", todoRouter);
// for API health checking
app.get("/api/health", (req, res) => {
  res.send("API is working fine");
});
// ---------------------------------//

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log("DB connected");
  } catch (error) {
    console.log("db connection error");
  }
  console.log("server is up :)");
});

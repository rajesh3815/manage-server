const express = require("express");
const { addPeople, getAllpeople } = require("../controllers/assigne");
const { verifyToken } = require("../middleware/VerifyToken");
const assigneRouter = express.Router();

assigneRouter.post("/assign", verifyToken, addPeople);
assigneRouter.get("/getPeople", verifyToken, getAllpeople);

module.exports = assigneRouter;

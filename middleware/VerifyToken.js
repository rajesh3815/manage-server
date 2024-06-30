const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      res.status(500).send({
        message: "token verify in  middleware errorr",
      });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decode);
    req.userId = decode.userId;
    next();
  } catch (error) {
    return res.status(500).send({
      message: "token verify Error",
    });
  }
};
module.exports = { verifyToken };

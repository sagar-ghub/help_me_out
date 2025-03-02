let middleware = {};
const JWT_SECRET = process.env.JWT_SECRET || "Ihaveasecret";
const jwt = require("jsonwebtoken");
middleware.checkUserAuth = (req, res, next) => {
  try {
    let token =
      typeof req.headers.authorization.split(" ") === "object" &&
      req.headers.authorization.split(" ").length === 2
        ? req.headers.authorization.split(" ")
        : false;
    // console.log("token", token);
    if (token) {
      //   console.log("token", token);
      verifyToken(token[1], (err, tokenData) => {
        if (!err && tokenData) {
          req.user = {};
          req.user = tokenData;
          // console.log("tokenData", tokenData);

          next();
        } else {
          res
            .status(403)
            .json({ status: "error", error: "Token not valid", err: err });
        }
      });
    } else {
      res
        .status(403)
        .json({ status: "error", error: "Token not valid", err: err });
    }
  } catch (err) {
    res
      .status(403)
      .json({ status: "error", error: "Token not valid", err: err });
  }
};

const verifyToken = (id, callback) => {
  //   console.log("id", id);
  jwt.verify(id, JWT_SECRET, function (err, data) {
    if (!err && data) {
      callback(err, data);
    } else {
      callback(err, false);
    }
  });
};

module.exports = middleware;

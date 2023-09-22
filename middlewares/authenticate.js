const jwt = require("jsonwebtoken");

const authenticate = (request, response, next) => {
      let jwtTokens;
      const authHeader = request.headers["authorization"];
      if (authHeader !== undefined) {
        jwtTokens = authHeader.split(" ")[1];
      }
      if (jwtTokens === undefined) {
        response.status(401);
        response.send("invalid user");
      } else {
        jwt.verify(jwtTokens, "bjbjbjsbjb", async (error, payload) => {
          if (error) {
            response.status(401);
            response.send("invalid user to access");
          } else {
            request.username = payload.username;
            next();
          }
        });
      }
    };

    module.exports = {authenticate}
const express = require("express");
const { initializeDBAndServer, } = require("./database/datastore");
const expressWinston = require("express-winston");
const { transports, format,} = require("winston");
const {router} = require ('./routes/booksRoutes');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')




const app = express();

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


app.use(
  expressWinston.logger({
    transports: [
      new transports.Console(),
      new transports.File({
        level: "warn",
        filename: "WarnLoggs.log",
      }),
      new transports.File({
        level: "info",
        filename: "infoLoggs.log",
      }),
    ],
    format: format.combine(
      format.json(),
      format.timestamp(),
      format.prettyPrint()
    ),
    statusLevels: true,
  })
);


app.use(express.json());



initializeDBAndServer().then(() => {
  app.listen(3000, () => {
    console.log("Server Running at http://localhost:3000/");
  });
  // app.get("/books/", getAllBooks);
  app.use("/",router);
});

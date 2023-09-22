const { getDB } = require("../database/datastore");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config()

// User Register API
const userRegisterApi = async (request, response) => {
  try {
    const db = getDB();
    const { username, name, password, gender, location } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const selectUserQuery = `
    SELECT
      *
    FROM
      user
    WHERE
      username = '${username}';`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
      const createUserQuery = `
     INSERT INTO
      user (username, name, password, gender, location)
     VALUES
      (
       '${username}',
       '${name}',
       '${hashedPassword}',
       '${gender}',
       '${location}'
      );`;
      await db.run(createUserQuery);
      response.send("User created successfully");
    } else {
      response.status(400);
      response.send("User already exists");
    }
  } catch (error) {
    console.log("getbooks error:", error);
    response.status(500).json({ "User Register Error": error });
  }
};

const userLoginApi = async (request, response) => {
  try {
    const db = getDB();
    const { username, password } = request.body;
    const selectUserQuery = `
        SELECT
          *
        FROM
          user
        WHERE
          username = '${username}';`;
    const dbUser = await db.get(selectUserQuery);

    if (dbUser === undefined) {
      response.status(400);
      response.send("Invalid User");
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
      if (isPasswordMatched === true) {
        const payload = {
          username: username,
        };
        const jwtToken = jwt.sign(payload, process.env.SecreteKey);
        response.send({ jwtToken });
      } else {
        response.status(400);
        response.send("Invalid Password");
      }
    }
  } catch (error) {
    console.log("getbooks error:", error);
    response.status(500).json({ "User Login Error": error });
  }
};

const getUserProfile = async (request, response) => {
  const db = getDB();
  const { username } = request;
  const user = `SELECT * FROM user WHERE username = '${username}'`;
  const userDetails = await db.get(user);
  response.send(userDetails);
};

const forgotAPi = async (request, response) => {
  try {
    const db = getDB();
    const { username } = request.body;
    const selectUserQuery = `
      SELECT
        *
      FROM
        user
      WHERE
        username = '${username}';`;
    const dbUser = await db.get(selectUserQuery);

    if (dbUser === undefined) {
      response.status(400);
      response.send("Invalid User");
    } else {
      const random = Math.random().toString(36).slice(-8);

      const transporter = nodemailer.createTransport({
        host: process.env.smtp_host,
        port: 587,
        secure: false,
        auth: {
          user: process.env.smtp_user,
          pass: process.env.smtp_password,
        },
      });
      var options = {
        from: process.env.smtp_user,
        to: `"${username}"`,
        subject: "TEST MAIL",
        text: `Your OTP Was -- ${random}`,
      };

      transporter.sendMail(options, (err, info) => {
        if (err) {
          return console.log(err);
        } else {
          return response.send(`OTP was sent to ${username}`);
        }
      });
    }
  } catch {
    return response.send("ERROR");
  }
};

module.exports = { userRegisterApi, userLoginApi, getUserProfile, forgotAPi };

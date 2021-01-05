// IMPORT REQUIRED LIBRARIES AND SECURITY PACKAGES
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const { v4: uuid } = require("uuid");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "dev";

//STANDARD MIDDLEWARE
app.use(morgan(morganOption));
//built in method that parses the request body
app.use(helmet());
app.use(cors());
app.use(express.json());

//STORE DATA IN MEMORY IN PLACE OF DATABASE
const users = [
  {
    id: "3c8da4d5-1597-46e7-baa1-e402aed70d80",
    username: "sallyStudent",
    password: "c00d1ng1sc00l",
    favoriteClub: "Cache Valley Stone Society",
    newsLetter: "true",
  },
  {
    id: "ce20079c-2326-4f17-8ac4-f617bfd28b7f",
    username: "johnBlocton",
    password: "veryg00dpassw0rd",
    favoriteClub: "Salt City Curling Club",
    newsLetter: "false",
  },
];

// ROUTES/ENDPOINTS
app.post("/", (req, res) => {
  console.log(req.body);
  res.send("POST request received.");
});

app.get("/", (req, res) => {
  res.send("A GET Request");
});

app.post("/user", (req, res) => {
  // get the data
  const { username, password, favoriteClub, newsLetter = false } = req.body;

  const CLUBS = [
    "Cache Valley Stone Society",
    "Ogden Curling Club",
    "Park City Curling Club",
    "Salt City Curling Club",
    "Utah Olympic Oval Curling Club",
  ];

  // validation code here; first consider if the value is required or not and if it is not required what do we do if it is not provided
  if (!username) {
    return res.status(400).send("Username required");
  }

  if (!password) {
    return res.status(400).send("Password required");
  }

  if (!favoriteClub) {
    return res.status(400).send("Favorite club required");
  }

  if (username.length < 6 || username.length > 20) {
    return res.status(400).send("Username must be between 6 and 20 characters");
  }

  if (password.length < 8 || password.length > 36) {
    return res.status(400).send("Password must be between 8 and 36 characters");
  }

  if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
    return res.status(400).send("Password must contain at least one digit");
  }

  if (!CLUBS.includes(favoriteClub)) {
    return res.status(400).send("Not a valid club");
  }

  const id = uuid();
  const newUser = {
    id,
    username,
    password,
    favoriteClub,
    newsLetter,
  };

  users.push(newUser);

  //at this point in the pipeline all validation passed
  res.status(204).end();
});

app.delete("/user/:userId", (req, res) => {
  // ...
});

// CATCH ANY THROWN ERRORS AND THEN DEFINE THE ERROR AND KEEP THE APPLICATION RUNNING; STILL MIDDLEWARE
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

//PIPELINE ENDS
module.exports = app;

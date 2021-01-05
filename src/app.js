// IMPORT REQUIRED LIBRARIES AND SECURITY PACKAGES
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "dev";

//STANDARD MIDDLEWARE
app.use(morgan(morganOption));
//built in method that parses the request body
app.use(helmet());
app.use(cors());
app.use(express.json());

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
  const { username, password, favoriteClub, newsLetter } = req.body;

  // validation code here
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

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const matcheRoutes = require("./api/routes/matches");
const playerRoutes = require("./api/routes/players");
const teamRoutes = require('./api/routes/teams');

mongoose.connect(
  "mongodb://node-shop:" +
    process.env.MONGO_ATLAS_PW +
    //todo: here I coonect with database
    ",,",
  {
    useMongoClient: true
  }
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/matches", matcheRoutes);
app.use("/players", playerRoutes);
app.use("/teams", teamRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;

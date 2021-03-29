const express = require("express");
// route
const userRoutes = require("./routes/userRoutes");
//Cors Middleware
const cors = require("cors");
//database require
const db = require("./db/models");
//passport signin authentication
const passport = require("passport");
//Passport Strategies
const { localStrategy, jwtStrategy } = require("./middleware/passport");

//start app
const app = express();

app.use(cors());
app.use(express.json());

//passport setup
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

// assign routes to url
app.use(userRoutes);

//Path Not found message for wrong paths
app.use((req, res, next) => {
  res.status(404).json({ message: "Path not found" });
});
//Error Handling Middleware. * 500 for error with no message or a status code
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message || "Internal Server Error",
  });
});

const run = async () => {
  try {
    await db.sequelize.sync();
    console.log("Connection to the database successful!");
    await app.listen(8005, () => {
      console.log("The application is running on localhost:8005");
    });
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
};
run();

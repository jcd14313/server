// Lib
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { expressjwt } = require("express-jwt");
const cors = require("cors");
const { body } = require("express-validator");

// Controllers
const authController = require("./controllers/auth");
const studentController = require("./controllers/students");

const { DB_URL, TOKEN_SECRET } = require("./constants");
const app = express();

// Connect to MongoDB database
mongoose
  .connect(DB_URL, { useNewUrlParser: true })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(
  expressjwt({
    credentialsRequired: true,
    secret: TOKEN_SECRET,
    requestProperty: "user",
    algorithms: ["HS256"],
  }).unless({ path: ["/api/signin", "/api/signup"] })
);

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(err.status).send({ message: err.message, error: true });
    return;
  }
  next();
});

app.post(
  "/api/signup",
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("username").not().isEmpty().withMessage("Username is required"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5 })
    .withMessage("Password should be atleas 5 characters"),

  authController.signup
);
app.post(
  "/api/signin",
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").not().isEmpty().withMessage("Password is required"),
  authController.signin
);

app.get("/api/students", studentController.allStudents);
app.get("/api/students/:studentId", studentController.getStudentByid);

app.post(
  "/api/students",
  body("id").not().isEmpty().withMessage("ID is required"),
  body("firstName").not().isEmpty().withMessage("Firstname is required"),
  body("lastName").not().isEmpty().withMessage("LastName is required"),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  studentController.createStudent
);
app.put(
  "/api/students/:studentId",
  body("id").not().isEmpty().withMessage("ID is required"),
  body("firstName").not().isEmpty().withMessage("Firstname is required"),
  body("lastName").not().isEmpty().withMessage("LastName is required"),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  studentController.updateStudent
);
app.delete("/api/students/:studentId", studentController.deleteStudent);

const port = 9000;
app.listen(port, () => {
  console.log(`A Node Js API is listening on port: ${port}`);
});

const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3021;
const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:19000",
  })
);
// middlewares
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
// middlewares

// routes
app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));

// routes

app.listen(port, () => {
  console.log("server running port ", port);
});

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Expense = require("./models/expense");
const session = require("express-session");
const auth = require("./auth");
const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const path = require("path");

app.use(
  session({
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use("/", expenseRoutes);
app.use("/", userRoutes);

mongoose.connect(process.env.MONGOURL, {
  useNewUrlParser: "true",
});
mongoose.connection.on("error", (err) => {
  console.log("err", err);
});
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected");
});

app.listen(3000);

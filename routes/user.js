const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const session = require("express-session");
const { schema } = require("../models/user");

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, password, username } = req.body;
    const user = new User({ firstname, lastname, username, password });
    const findUser = await User.findOne({ username: username });
    if (findUser) {
      res.redirect("/register");
    } else {
      await user.save();
      res.redirect("/login");
    }
  } catch (err) {
    res.render("error.ejs", { err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validPassword) {
        req.session.user_id = user._id;
        req.session.username = user.username;
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/register");
    }
  } catch (err) {
    res.render("error", { err });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;

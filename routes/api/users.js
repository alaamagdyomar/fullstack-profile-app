// bring express:
const express = require("express");
const router = express.Router();

// load user model
const user = require("../../models/User");

// @route Get Api/users/test
// desc   tests users route
// @access public

router.get("/test", (req, res) => res.json({ msg: "users works" }));

// @route Get Api/users/register
// desc   register user
// @access public

router.post("./register", (req, res) => {
  user.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "email already exists" });
    }
  });
});

module.exports = router;

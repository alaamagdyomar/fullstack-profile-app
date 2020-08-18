const express = require("express"); // bring express:
const router = express.Router();
const gravatar = require("gravatar"); // load gravatar
const bcrypt = require("bcryptjs"); // load bcrypt

const User = require("../../models/User"); // load user model

// @route Get Api/users/test
// desc   tests users route
// @access public

router.get("/test", (req, res) => res.json({ msg: "users works" }));

// @route Get Api/users/register
// desc   register user
// @access public

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "500",
        r: "pg",
        d: "mm",
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        // avatar:avatar
        avatar,
        password: req.body.password,
      });

      // bcrypt the user pass & generate the hash in the database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

module.exports = router;

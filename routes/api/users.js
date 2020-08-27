const express = require("express"); // bring express:
const router = express.Router(); // loas express router
const gravatar = require("gravatar"); // load gravatar
const bcrypt = require("bcryptjs"); // load bcrypt
const jwt = require("jsonwebtoken"); // load jsonWebToken
const keys = require("../../config/keys");
const passport = require("passport"); // load passport
const User = require("../../models/User"); // load user model
const validateRegisterInput = require("../../validation/register"); // register input validation
const validateLoginInput = require("../../validation/login"); // login input validation

// @route Get Api/users/test
// desc   tests users route
// @access public

router.get("/test", (req, res) => res.json({ msg: "users works" }));

// @route post Api/users/register
// desc   register user
// @access public

router.post("/register", (req, res) => {
  // make validation first
  const { errors, isValid } = validateRegisterInput(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
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

  // @route Get Api/users/login
  // desc   login user /  returns jwt token
  // @access public

  router.post("/login", (req, res) => {
    // make validation first
    const { errors, isValid } = validateLoginInput(req.body);
    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    // find user by email
    user.findOne({ email }).then((user) => {
      // check for user
      if (!user) {
        errors.email = "user not found";
        return res.status(404).json(errors);
      }
      // check for password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // res.json({ msg: "success" });
          // then it is matched so therefor create the user payload
          const payload = { id: user.id, name: user.name, avatar: user.avatar };
          // sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer" + token,
              });
            }
          );
        } else {
          errors.password = "password incorrect";
          return res.status(400).json(errors);
        }
      });
    });
  });
});

// @route Get Api/users/current
// desc   return current user
// @access private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;

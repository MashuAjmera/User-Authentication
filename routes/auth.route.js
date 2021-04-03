const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleTokenStrategy = require("passport-google-token").Strategy;
let User = require("../models/user.model");
const auth = require("../helpers/auth.helper");
const mail = require("../helpers/mail.helper");

router.post("/login", async (req, res) => {
  const { email, password, rememberMe } = req.body;
  // Simple validation
  if (!email || !password) {
    return res.status(400).json("Please enter all fields");
  }

  try {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) throw Error("User Does not exist");
    if (!user.method.local)
      return res.status(400).json("You signed up using Facebook/Google.");
    if (!user.method.local.confirmed)
      throw new Error("Please confirm your email to login");

    const isMatch = await bcrypt.compare(password, user.method.local.password);
    if (!isMatch) throw Error("Invalid credentials");

    const token = jwt.sign({ id: user._id }, process.env.jwtSecret, {
      expiresIn: rememberMe ? "7d" : 3600,
    });
    if (!token) throw Error("Couldnt sign the token");

    res.status(200).json({
      token,
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json("" + err);
  }
});

router.post("/register", async (req, res) => {
  const { fname, email, password, lname } = req.body;
  // Simple validation
  if (!fname || !email || !password || !lname) {
    return res.status(400).json("Please enter all fields");
  }

  try {
    const user = await User.findOne({ email });
    if (user) throw Error("User already exists");

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error("Something went wrong with bcrypt");

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error("Something went wrong hashing the password");

    const newUser = new User({
      fname,
      lname,
      email,
      "method.local.password": hash,
    });
    const savedUser = await newUser.save();
    if (!savedUser) throw Error("Something went wrong saving the user");

    const token = jwt.sign({ id: savedUser._id }, process.env.jwtSecret, {
      expiresIn: "1d",
    });
    res.status(200).json("Account Created. Kindly confirm mail.");

    const output = `
    <p>Thanks for creating a new account. Kindly click on the registration link below to confirm</p>
    <h3>Account Details</h3>
    <ul>
      <li>Name: ${savedUser.fname} ${savedUser.lname}</li>
      <li>Email: ${savedUser.email}</li>
      <li>Registration Link: <a href="https://userauthentic.herokuapp.com/api/auth/confirm/${token}">Click here</a></li>
    </ul>
  `;

    const textoutput = `Account Confirmation Request- Name: ${savedUser.fname} ${savedUser.lname}, Email: ${savedUser.email}, Registration Link: <a href="https://userauthentic.herokuapp.com/api/auth/confirm/${token}" >Click here</a>`;

    let mailOptions = {
      from: `"User Authentication" <${process.env.mailUser}>`, // Server Email Address
      to: savedUser.email, // Host Email Address
      subject: "Account Registration Request | User Authentication", // Subject line
      text: textoutput, // plain text body
      html: output, // html body
    };

    mail(mailOptions);
  } catch (err) {
    res.status(400).json("" + err);
  }
});

router.get("/confirm/:token", async (req, res) => {
  const decoded = jwt.verify(req.params.token, process.env.jwtSecret);
  if (!decoded) throw Error("user verification failed");

  await User.updateOne(
    { _id: decoded.id },
    { $set: { "method.local.confirmed": true } }
  )
    .then(() => res.redirect("/"))
    .catch((err) => res.status(400).json("" + err));
});

router.post("/forgot/:email", async (req, res) => {
  const email = req.params.email;

  // Simple validation
  if (!email) {
    return res.status(400).json("Please enter email.");
  }

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json("Account doesnot exist. Kindly create a new account.");
    else if (!user.method.local)
      return res.status(400).json("You signed up using Facebook/Google");

    const token = jwt.sign({ id: user._id }, process.env.jwtSecret, {
      expiresIn: "1d",
    });

    const output = `
    <p>Don't wory! You'll soon be able to access your account again. Kindly click on the link below to change your password.</p>
    <h3>Account Details</h3>
    <ul>
      <li>Name: ${user.fname} ${user.lname}</li>
      <li>Email: ${user.email}</li>
      <li>Registration Link: <a href="https://userauthentic.herokuapp.com/reset/${token}">Click here</a></li>
    </ul>
  `;

    const textoutput = `Password Reset Link- Name: ${user.fname} ${user.lname}, Email: ${user.email}, Registration Link: <a href="http://localhost:5000/confirm/${token}">Click here</a>`;

    let mailOptions = {
      from: `"User Authentication" <${process.env.mailUser}>`, // Server Email Address
      to: user.email, // Host Email Address
      subject: "Password Reset Request | User Authentication", // Subject line
      text: textoutput, // plain text body
      html: output, // html body
    };
    mail(mailOptions);

    res.status(200).json("Check mail for link to reset password.");
  } catch (err) {
    res.status(400).json("" + err);
  }
});

router.post("/reset/", auth, async (req, res) => {
  const { password } = req.body;

  // Simple validation
  if (!password) {
    return res.status(400).json("Please enter password.");
  }

  try {
    const user = await User.findById(req.user.id);

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error("Something went wrong with bcrypt");

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error("Something went wrong hashing the password");

    user.method.local.password = hash;
    user
      .save()
      .then(() => res.status(200).json("Password Reset Successful."))
      .catch((err) => res.status(400).json("" + err));
  } catch (err) {
    res.status(400).json("" + err);
  }
});

// Google OAuth Strategy
passport.use(
  "googleToken",
  new GoogleTokenStrategy(
    {
      clientID: process.env.google_clientID,
      clientSecret: process.env.google_clientSecret,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Could get accessed in two ways:
        // 1) When registering for the first time
        // 2) When linking account to the existing one

        // Should have full user profile over here
        if (req.user) {
          // We're already logged in, time for linking account!
          // Add Google's data to an existing account
          req.user.method = { ...req.user.method, google: profile.id };
          await req.user.save();
          return done(null, req.user);
        } else {
          // We're in the account creation process
          let existingUser = await User.findOne({
            "method.google": profile.id,
          });
          if (existingUser) {
            return done(null, existingUser);
          }

          // Check if we have someone with the same email
          existingUser = await User.findOne({ email: profile.emails[0].value });
          if (existingUser) {
            // We want to merge google's data with local auth
            existingUser.method = {
              ...existingUser.method,
              google: profile.id,
            };
            await existingUser.save();
            return done(null, existingUser);
          }

          const newUser = new User({
            fname: profile.displayName,
            lname: profile.displayName,
            email: profile.emails[0].value,
            method: {
              google: profile.id,
            },
          });

          await newUser.save();
          done(null, newUser);
        }
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

router.route("/google").post(
  passport.authenticate("googleToken", {
    session: false,
    scope: ["profile", "email"],
  }),
  (req, res) => {
    // Generate token
    const token = jwt.sign({ id: req.user._id }, process.env.jwtSecret, {
      expiresIn: 3600,
    });
    if (!token) throw Error("Couldnt sign the token");

    res.status(200).json({
      token,
      user: {
        id: req.user._id,
        fname: req.user.lname,
        lname: req.user.lname,
        email: req.user.email,
      },
    });
  }
);

module.exports = router;

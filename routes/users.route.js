const router = require("express").Router();
let User = require("../models/user.model");
const auth = require("../helpers/auth.helper");

router.route("/:_id").get((req, res) => {
  console.log("hi");
  User.findById(req.params._id)
    .then((user) => res.json({ fname: user.fname, lname: user.lname }))
    .catch((err) => res.status(400).json("" + err));
});

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-method");
    if (!user) throw Error("User Does not exist");
    res.json(user);
  } catch (err) {
    res.status(400).json("" + err);
  }
});

router.post("/update", auth, async (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      user.name = req.body.name;
      user.country = req.body.country;
      user.phone = Number(req.body.phone);
      user
        .save()
        .then(() => res.json("Profile updated!"))
        .catch((err) => res.status(400).json("" + err));
    })
    .catch((err) => res.status(400).json("" + err));
});

module.exports = router;

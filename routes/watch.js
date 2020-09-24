const express = require("express");
const controller = require("../controllers/watch");
const router = express.Router();
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.watch
);

module.exports = router;

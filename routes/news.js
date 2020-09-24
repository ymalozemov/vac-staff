const express = require("express");
const controller = require("../controllers/news");
const router = express.Router();

const passport = require("passport");

router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  controller.update
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getAll
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getById
);

module.exports = router;

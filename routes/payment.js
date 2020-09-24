const express = require("express");
const controller = require("../controllers/payment");
const router = express.Router();
const passport = require("passport");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  controller.create
);
router.post(
  "/create-ta",
  passport.authenticate("jwt", { session: false }),
  controller.createTa
);
router.post(
  "/message",
  passport.authenticate("jwt", { session: false }),
  controller.sendMessage
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getAllToday
);
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  controller.getAllTodayUser
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getById
);
router.post(
  "/approve",
  passport.authenticate("jwt", { session: false }),
  controller.approve
);
router.post(
  "/unapprove",
  passport.authenticate("jwt", { session: false }),
  controller.unapprove
);
router.post(
  "/find",
  passport.authenticate("jwt", { session: false }),
  controller.find
);
router.post(
  "/updateById",
  passport.authenticate("jwt", { session: false }),
  controller.updateById
);
router.post(
  "/updateRefStatus",
  passport.authenticate("jwt", { session: false }),
  controller.updateRefStatus
);

module.exports = router;

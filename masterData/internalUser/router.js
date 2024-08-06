const express = require('express');
const passport = require('passport');
const middleware = require("../../middleware/userrole");
const controller = require("./controller");
const multer = require("multer");

const router = express.Router();

router
  .post("/add",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.uploadAttachment,
    controller.saveAttachment,
    controller.create
  );

router
  .patch("/edit/:id",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.uploadAttachment,
    controller.saveAttachment,
    controller.updateById
  );

router
  .delete("/delete/:id",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.deleteById
  );

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.internalUserList);
router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.getById);

module.exports = router
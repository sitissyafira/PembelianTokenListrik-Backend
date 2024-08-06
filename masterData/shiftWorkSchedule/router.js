const express = require('express');
const passport = require('passport');
const middleware = require("../../middleware/userrole");
const controller = require("./controller");
const multer = require("multer");

const router = express.Router();

router.get(
  "/list/mobile",
  // [passport.authenticate("jwt", { session: false}), middleware.isEngineer],
  controller.shiftListMobile
)

router
  .post("/add",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.create
  );

router.get(
    "/list",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.shiftList
)

router
  .patch("/edit/:id",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.updateById
  );

router
  .delete("/delete/:id",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.deleteById
  );

router.get(
    "/:id",
    [passport.authenticate("jwt", { session: false})],
    controller.getShiftById
)


module.exports = router
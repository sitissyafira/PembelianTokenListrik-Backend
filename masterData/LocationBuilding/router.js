const express = require('express');
const passport = require('passport');
const middleware = require("../../middleware/userrole");
const controller = require("./controller");
const multer = require("multer");

const router = express.Router();

router.get(
  "/list/mobile",
  // [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.getListByMobile
)

router
  .post("/add",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.create
  );

router.get(
    "/list",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.locationBuildingList
)

router.get(
    "/locationSuggestion",
    controller.getLocationSuggestionFromOpenStreetMap
)

module.exports = router
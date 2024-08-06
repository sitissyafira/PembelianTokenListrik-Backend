const express = require("express");
const router = express.Router();
const passport = require("passport");
const middleware = require("../../middleware/userrole");
const controller = require("./controller");

router.post(
  "/create",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.createMasterList
);

router.patch(
  "/update/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.updateMasterList
);

router.get(
  "/list/all",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.getAllDataMasterBE
);

router.get(
  "/mob/list/all",
  [passport.authenticate("jwt", { session: false }), middleware.isCustomer],
  controller.getAllDataMasterMobile
);

router.get(
  "/list",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.getAllMaster
);

router.get(
  "/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.findRate
);

router.get(
  "/rttoken/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.findRateToken
);

router.delete(
  "/delete/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isSpvFinance],
  controller.deleteRate
);

// =========================================================

// router.post("/create", controller.createMasterList);

// router.patch("/update/:id", controller.updateMasterList);

// router.get("/list/all", controller.getAllDataMasterBE);

// router.get("/mob/list/all", controller.getAllDataMasterMobile);

// router.get("/list", controller.getAllMaster);

// router.get("/:id", controller.findRate);

// router.get("/rttoken/:id", controller.findRateToken);

// router.delete("/delete/:id", controller.deleteRate);

module.exports = router;

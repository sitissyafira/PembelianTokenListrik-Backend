const express = require("express");
const router = express.Router();
const passport = require("passport");
const controller = require("./controller");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.showDashboard
);

router.get
("/tro", 
controller.DashboardForTRO);

router.get
("/engineer", 
controller.DashboardForEngineer);

router.get
("/cs", 
controller.DashboardForCS);

router.get
("/finance", 
controller.DashboardForFinance);

router.get
("/manager", 
controller.DashboardForManager);

router.get("/new", controller.NewDashboard)

module.exports = router;

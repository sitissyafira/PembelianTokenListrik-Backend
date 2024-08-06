const express = require("express");
const passport = require("passport");
const middleware = require("../../../middleware/userrole");
const controller = require("./controller");

const router = express.Router();

router.get(
  "/list",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.getAll
);

router.get(
  "/all/list_AccBudget",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.getAllNoParamAccBudget
);

router.get(
  "/all/list",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.getAllNoParam
);

router.post(
  "/add",
  [passport.authenticate("jwt", { session: false }), middleware.isAdminTro],
  controller.create
);

router.get(
  "/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isAdminTro],
  controller.getById
);
router.patch(
  "/edit/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isAdminTro],
  controller.update
);
router.delete(
  "/delete/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isSpvTro],
  controller.delete
);

router.get(
  "/list/fixed",
  [passport.authenticate("jwt", { session: false }), middleware.isAdminFinance],
  controller.getlistfixed
);

router.get(
  "/list/accumulated",
  [passport.authenticate("jwt", { session: false }), middleware.isAdminFinance],
  controller.getlistaccumulated
);

router.get(
  "/list/expensecogs",
  [passport.authenticate("jwt", { session: false }), middleware.isAdminFinance],
  controller.getlistexpensecogs
);

module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");
const middleware = require("../../../middleware/userrole");
const controller = require("./controller");

router.get(
  "/",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.Defect
);
router.get(
  "/relation/category",
  [passport.authenticate("jwt", { session: false }), middleware.isSpvEngineer],
  controller.listCategory
);
router.get(
  "/:id/",
  [
    passport.authenticate("jwt", { session: false }),
    middleware.isAdminEngineer,
  ],
  controller.DefectById
);
router.get(
  "/relation/category/:id/",
  [passport.authenticate("jwt", { session: false }), middleware.isSpvEngineer],
  controller.CategoryById
);
router.get(
  "/generate/code",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.DefectGenerator
);
router.post(
  "/add",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.tambahDefect
);
router.patch(
  "/edit/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isSpvEngineer],
  controller.updateDefect
);
router.delete(
  "/delete/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isSpvEngineer],
  controller.hapusDefect
);

router.get(
  "/parent/:id/",
  [passport.authenticate("jwt", { session: false }), middleware.isCustomer],
  controller.DefectByParent
);

router.get(
  "/:id/",
  [passport.authenticate("jwt", { session: false }), middleware.isCustomer],
  controller.DefectById
);

module.exports = router;

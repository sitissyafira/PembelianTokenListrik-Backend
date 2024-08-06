const express = require("express");
const router = express.Router();
const passport = require("passport");
const middleware = require("../../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate("jwt", { session: false }), middleware.isAdminTro], controller.Role);
router.get("/:id/", [passport.authenticate("jwt", { session: false }), middleware.isAdminTro], controller.RoleById);
router.post("/add", [passport.authenticate("jwt", { session: false }), middleware.isAdminTro], controller.tambahRole);
router.patch("/edit/:id", [passport.authenticate("jwt", { session: false }), middleware.isAdminTro], controller.updateRole);
router.delete("/delete/:id", [passport.authenticate("jwt", { session: false }), middleware.isSpvTro], controller.hapusRole);
router.get("/generate/code", [passport.authenticate("jwt", { session: false }), middleware.isAdminTro], controller.roleCodeGenerator);

module.exports = router;

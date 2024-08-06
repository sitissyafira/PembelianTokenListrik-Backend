const express = require("express");
const router = express.Router();
const passport = require("passport");
const middleware = require("../../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate("jwt", { session: false }), middleware.isEngineer], controller.Bank);
router.get("/:id/", [passport.authenticate("jwt", { session: false }), middleware.isAdminTro], controller.BankById);
router.post("/add", [passport.authenticate("jwt", { session: false }), middleware.isEngineer], controller.tambahBank);
router.get("/bank/coa", [passport.authenticate("jwt", { session: false }), middleware.isEngineer], controller.bankCOA);
router.patch("/edit/:id", [passport.authenticate("jwt", { session: false }), middleware.isEngineer], controller.updateBank);
router.delete("/delete/:id", [passport.authenticate("jwt", { session: false }), middleware.isSpvTro], controller.hapusBank);

module.exports = router;

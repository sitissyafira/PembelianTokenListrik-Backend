const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isEngineer], controller.Acctbank);
router.get("/:id/", [passport.authenticate('jwt', {session: false}), middleware.isEngineer], controller.AcctbankById);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isEngineer], controller.tambahAcctbank);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isEngineer], controller.updateAcctbank);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isSpvTro], controller.hapusAcctbank);

//mobile
router.get("/mobile/list", [passport.authenticate('jwt', {session: false}), middleware.isCustomer], controller.AcctBankMobile);

module.exports = router;
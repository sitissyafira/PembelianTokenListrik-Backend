const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.Fiscal);
router.get("/:id/", [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.FiscalById);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.tambahFiscal);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.updateFiscal);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isSpvFinance], controller.hapusFiscal);


module.exports = router;
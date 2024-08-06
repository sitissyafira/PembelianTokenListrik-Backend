const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../middleware/userrole")
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.Uom);
router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.UomById);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.tambahUom);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.updateUom);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isSpvFinance], controller.hapusUom);


module.exports = router;
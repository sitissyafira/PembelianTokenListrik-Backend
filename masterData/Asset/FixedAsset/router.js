const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.Fixed);
router.get("/:id/", [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.FixedById);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.tambahFixed);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.updateFixed);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isSpvFinance], controller.hapusFixed);


module.exports = router;
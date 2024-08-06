const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../middleware/userrole");
const controller = require("./controller");

// router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.listUntRate);
// router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.listUntRateById);
// router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.addUntRate);
// router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.updateUntRate);
// router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.deleteUntRate);

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdminTro], controller.listUntRate);
router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdminTro], controller.listUntRateById);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdminTro], controller.addUntRate);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdminTro], controller.updateUntRate);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isSpvTro], controller.deleteUntRate);

module.exports = router;
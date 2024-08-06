const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../middleware/userrole");
const controller = require("./controller");

// router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.unitType);
// router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.unitTypeById);
// router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.tambahUnitType);
// router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.updateUnitType);
// router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.hapusUnitType);

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdminTro], controller.unitType);
router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdminTro], controller.unitTypeById);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdminTro], controller.tambahUnitType);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdminTro], controller.updateUnitType);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isSpvTro], controller.hapusUnitType);

module.exports = router;
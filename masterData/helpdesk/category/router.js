const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../../middleware/userrole");
const controller = require("./controller");

router.get("/", [passport.authenticate('jwt', {session: false}), middleware.isAdminEngineer], controller.Category);
router.get("/:id/", [passport.authenticate('jwt', {session: false}), middleware.isAdminEngineer], controller.CategoryById);
router.get("/generate/code", [passport.authenticate('jwt', {session: false}), middleware.isAdminEngineer], controller.CategoryGenerator);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdminEngineer], controller.tambahCategory);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdminEngineer], controller.updateCategory);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isSpvEngineer],controller.hapusCategory);

//categorymobile
router.get("/list/mobile", [passport.authenticate('jwt', {session: false}), middleware.isCustomer], controller.CategoryMobile);
module.exports = router;
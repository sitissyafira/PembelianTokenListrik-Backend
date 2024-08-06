const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../../middleware/userrole");
const controller = require("./controller");

router.get("/", [passport.authenticate('jwt', {session: false}), middleware.isAdminEngineer], controller.SubDefect);
router.get("/relation/category", [passport.authenticate('jwt', {session: false}), middleware.isSpvEngineer], controller.listDefect);
router.get("/:id/", [passport.authenticate('jwt', {session: false}), middleware.isEngineer], controller.SubDefectById);
router.get("/relation/category/:id/", [passport.authenticate('jwt', {session: false}), middleware.isSpvEngineer], controller.DefectById);
router.get("/generate/code", [passport.authenticate('jwt', {session: false}), middleware.isAdminEngineer], controller.SubDefectGenerator);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdminEngineer], controller.tambahSubDefect);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdminEngineer], controller.updateSubDefect);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isSpvEngineer], controller.hapusSubDefect);

router.get("/parent/:id/", [passport.authenticate('jwt', {session: false}), middleware.isCustomer], controller.SubDefectByParent);

module.exports = router;
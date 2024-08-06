const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.Engineer);
router.get("/generate/code", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.engineerNumber);
router.get("/:id/", [passport.authenticate('jwt', {session: false})], controller.EngineerById);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.uploadAttachment, controller.saveAttachment, controller.tambahEngineer);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.uploadAttachment, controller.saveAttachment, controller.updateEngineer);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.hapusEngineer);


module.exports = router;
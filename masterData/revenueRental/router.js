const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.RevenueRental);
router.get("/:id/", [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.RevenueRentalById);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.tambahRevenueRental);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdminFinance], controller.updateRevenueRental);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isSpvFinance], controller.hapusRevenueRental);

module.exports = router;
const express = require("express");
const passport = require("passport");

const middleware = require("../../middleware/userrole");
const controller = require("./controller");

const router = express.Router();

router.post("/add", [passport.authenticate("jwt", {
    session: false
}), middleware.isAdminFinance], controller.createBillingBank)

router.get("/list", [passport.authenticate("jwt", {
    session: false
}), middleware.isCustomer], controller.getAll)

router.patch("/edit/:id",  [passport.authenticate("jwt", {
    session: false
}), middleware.isAdminFinance], controller.updateBillingBank )

router.patch("/deleteflag/:id", [passport.authenticate("jwt", {
    session: false
}), middleware.isAdminFinance], controller.deleteFlag )

router.delete("/delete/:id", [passport.authenticate("jwt", {
    session: false
}), middleware.isAdminFinance], controller.delete)

module.exports = router;
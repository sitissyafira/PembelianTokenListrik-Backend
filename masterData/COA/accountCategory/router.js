const express = require("express");
const passport = require("passport");
const middleware = require("../../../middleware/userrole");
const controller = require("./controller");

const router = express.Router();

router
    .get("/list", [passport.authenticate("jwt", { session: false }), middleware.isAdminFinance], controller.getAll);

router
    .post("/add", [passport.authenticate("jwt", { session: false }), middleware.isAdminFinance], controller.createOne);

router
    .get("/:id", [passport.authenticate("jwt", { session: false }), middleware.isAdminFinance], controller.getOne);

router
    .delete("/delete-acctCat/:id", [passport.authenticate("jwt", { session: false }), middleware.isAdminFinance], controller.deleteAcctCat);

module.exports = router;
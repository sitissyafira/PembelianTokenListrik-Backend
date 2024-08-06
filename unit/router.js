const express = require("express");
const router = express.Router();
const passport = require("passport");
const middleware = require("../middleware/userrole");
const controller = require("./controller");

router.get("/listuntmobile", [passport.authenticate("jwt", { session: false }), middleware.isCustomer], controller.listUntMobile);
router.get("/listidmobile/:id", [passport.authenticate("jwt", { session: false }), middleware.isCustomer], controller.listUntByIdMobile);
router.get("/parentmobile/:id", [passport.authenticate("jwt", { session: false }), middleware.isCustomer], controller.getByParentIdMobile);
router.post("/addmobile", [passport.authenticate("jwt", { session: false }), middleware.isCustomer], controller.addUntMobile);
router.patch("/editmobile/:id", [passport.authenticate("jwt", { session: false }), middleware.isCustomer], controller.updateUntMobile);
router.delete("/deletemobile/:id", [passport.authenticate("jwt", { session: false }), middleware.isCustomer], controller.deleteUntMobile);

router.get("/list-bast", [passport.authenticate("jwt", { session: false }), middleware.isEngineer], controller.listUnitFromBAST);

router.get("/list", [passport.authenticate("jwt", { session: false }), middleware.isEngineer], controller.listUnt);
router.get("/list/parking", [passport.authenticate("jwt", { session: false }), middleware.isEngineer], controller.listUntForParking);

router.get("/list/searchunit", [passport.authenticate("jwt", { session: false }), middleware.isEngineer], controller.searchUnit);

router.get("/:id", [passport.authenticate("jwt", { session: false }), middleware.isEngineer], controller.listUntById);
router.get("/unit/:id", [passport.authenticate("jwt", { session: false }), middleware.isEngineer], controller.findUnitByID);
router.get("/parent/:id", [passport.authenticate("jwt", { session: false }), middleware.isEngineer], controller.getByParentId);
router.get("/parentpwr/:id", [passport.authenticate("jwt", { session: false }), middleware.isEngineer], controller.getByUnitforPwr);
router.get("/parentwtr/:id", [passport.authenticate("jwt", { session: false }), middleware.isEngineer], controller.getByUnitforWtr);
router.get("/owncontract/:id", [passport.authenticate("jwt", { session: false }), middleware.isAdminTro], controller.getByUnitforContract);
router.get("/rentercontract/:id", [passport.authenticate("jwt", { session: false }), middleware.isAdminTro], controller.getByUnitforContractRenter);

router.get("/customer/:id", [passport.authenticate("jwt", { session: false }), middleware.isAdminTro], controller.getUnitCustomer);
router.post("/add", [passport.authenticate("jwt", { session: false }), middleware.isAdminTro], controller.addUnt);
router.patch("/edit/:id", [passport.authenticate("jwt", { session: false }), middleware.isAdminTro], controller.updateUnt);
router.delete("/delete/:id", [passport.authenticate("jwt", { session: false }), middleware.isSpvTro], controller.deleteUnt);

module.exports = router;

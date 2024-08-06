const express = require("express");
const router = express.Router();
const passport = require("passport");
const middleware = require("../middleware/userrole");
const controller = require("./controller");

router.get(
  "/generate-trtoken",
  [],
  controller.autoCreateARDN
);

router.post(
  "/create",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.crtTopup
);

router.post(
  "/status/transaction",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.getStatusTransaction
);

router.get(
  "/get/all",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.getAll
);

router.get(
  "/get/query",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.getAllDataQueryUnitDate
);

router.get(
  "/trdetail/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.getTransferDetail
);

router.get("/get/cdtrans", controller.getCodeTransaksi);

router.get(
  "/get/unit",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.getAllUnit
);

router.get(
  "/get/engineer",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.getEngineer
);

router.get(
  "/get/paymtd",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.getPaymentMtd
);

router.get(
  "/get/acctbank",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.getCompBankAcc
);

router.get(
  "/get/banklist",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.getBankList
);

router.get(
  "/get/balance",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.getBalance
);

router.get(
  "/get/print/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.printData
);

router.delete(
  "/delete/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
  controller.deleteTokenTrans
);

router.post(
  "/mob/create",
  [passport.authenticate("jwt", { session: false }), middleware.isCustomer],
  controller.crtTopupMobile
);

router.get(
  "/mob/get/balance",
  [passport.authenticate("jwt", { session: false }), middleware.isCustomer],
  controller.getBalanceMobile
);

router.get("/mob/get/cdtrans", controller.getCodeTransaksiMobile);

router.get(
  "/mob/get/masterpower",
  [passport.authenticate("jwt", { session: false }), middleware.isCustomer],
  controller.getMasterPowMobile
);

router.get(
  "/mob/get/paymtd",
  [passport.authenticate("jwt", { session: false }), middleware.isCustomer],
  controller.getPayMetdMobile
);

router.get(
  "/mob/get/banklist",
  [passport.authenticate("jwt", { session: false }), middleware.isCustomer],
  controller.getBankListMobile
);

router.get(
  "/mob/get/trdetailuser",
  [passport.authenticate("jwt", { session: false }), middleware.isCustomer],
  controller.getTransDetailUser
);

router.get(
  "/mob/get/prgrengineer",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.getTransDetailEngineer
);

router.delete(
  "/mob/delete/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isCustomer],
  controller.deleteTokenTransMobile
);

router.get(
  "/fixing-topup",
  [passport.authenticate("jwt", { session: false }), middleware.isCustomer],
  controller.fixingTopUp
);

// router.get(
//     "/getransaksi" 
//   [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
//   controller.generateTransaksiTopUp
// );

//====================================================================
// router.get(
//   "/search",
//   [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
//   controller.getAllListRegex
// );

// router.post("/create", controller.crtTopup);
// router.post("/status/transaction", controller.getStatusTransaction);
// router.get("/get/all", controller.getAll);
// router.get("/get/query", controller.getAllDataQueryUnitDate);
// router.get("/trdetail/:id", controller.getTransferDetail);
// router.get("/get/cdtrans", controller.getCodeTransaksi);
// router.get("/get/unit", controller.getAllUnit);
// router.get("/get/engineer", controller.getEngineer);
// router.get("/get/paymtd", controller.getPaymentMtd);
// router.get("/get/acctbank", controller.getCompBankAcc);
// router.get("/get/banklist", controller.getBankList);
// router.get("/get/balance", controller.getBalance);
// router.get("/get/print/:id", controller.printData);
// router.delete("/delete/:id", controller.deleteTokenTrans);

// router.post("/mob/create", controller.crtTopupMobile);
// router.get("/mob/get/balance", controller.getBalanceMobile);
// router.get("/mob/get/cdtrans", controller.getCodeTransaksiMobile);
// router.get("/mob/get/masterpower", controller.getMasterPowMobile);
// router.get("/mob/get/trdetailuser", controller.getTransDetailUser);
// router.get("/mob/get/paymtd", controller.getPayMetdMobile);
// router.get("/mob/get/banklist", controller.getBankListMobile);
// router.delete("/mob/delete/:id", controller.deleteTokenTransMobile);

module.exports = router;

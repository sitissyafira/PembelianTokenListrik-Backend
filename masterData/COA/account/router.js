const express = require("express");
const passport = require("passport");
const middleware = require("../../../middleware/userrole");
const controller = require("./controller");

const router = express.Router();

const multer = require('multer')
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const uploadFileExcel = multer({ storage });

// LIST PARENT ====================================================================
router.get(
  "/get/parent",
  [passport.authenticate("jwt", { session: false }), middleware.isAdminTro],
  controller.apiListParent
);

// API FIXING =====================================================================
router.get(
  "/parent-fixing",
  [passport.authenticate("jwt", { session: false }), middleware.isAdminTro],
  controller.fixingParentAtChilds
);
router.get(
  "/add-opening-balance",
  [passport.authenticate("jwt", { session: false }), middleware.isAdminTro],
  controller.addOpeningBalance
);

// ================================================================================

router.get(
  "/list-header",
  [passport.authenticate("jwt", { session: false }), middleware.isAdminTro],
  controller.apiHeaderCOA
);

router.get(
  "/list",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.getAll
);
router.post(
  "/add",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.createAccount
);
router.get(
  "/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isAdminTro],
  controller.getById
);

router.get(
  "/list/acctype/cashbankAR",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.getByAccountTypeCashBankAR
);

router.get(
  "/list/acctype/cashbank",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.getByAccountTypeCashBank
);

router.get(
  "/list/expenditures",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.getByAccountForExpenditures
);
// router.get(
//   "/list/glaccount",
//   [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
//   controller.getAccountforGLAccount
// );

// ===================================================================================
// ===================================================================================
router.get("/list/glaccountAR", controller.getAccountforGLAccountAR);

router.get("/list/glaccountAP", controller.getAccountforGLAccountAP);

router.get("/list/glaccountSODebit", controller.getAccountforGLAccountSODebit);

router.get("/list/glaccountSOCredit", controller.getAccountforGLAccountSOCredit);

// ===================================================================================
// ===================================================================================
// router.patch(
//   "/edit-coa",
//   [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
//   controller.fixCOA
// );

router.patch(
  "/edit-details",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.updateManyDetails
);

router.patch(
  '/edit-opening',
  [passport.authenticate('jwt', { session: false }), middleware.isEngineer],
  uploadFileExcel.single("fileExcel"),
  controller.importexcel
);

router.patch(
  "/edit-balance",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.updateManyBalance
);

router.patch(
  "/edit-parent",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.updateParentBalance
);

router.patch(
  "/edit-category",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.updateCategory
);

router.patch(
  "/edit/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.update
);

router.delete(
  "/delete/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isSpvTro],
  controller.delete
);

router.post(
  "/list/selected/acctype",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.getSelectedAccountType
);

router.get(
  "/list/coa/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
  controller.getByAccountType
);

router.get(
  "/list/gl",
  [passport.authenticate("jwt", { session: false }), middleware.isAdminTro],
  controller.getgeneralledger
);

module.exports = router;


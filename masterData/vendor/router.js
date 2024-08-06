const express = require('express');
const passport = require('passport');
const middleware = require('../../middleware/userrole');
const controller = require('./controller');
const multer = require("multer");

const router = express.Router();

router
    .get('/excel/export' ,[], controller.DownloadFormatXlxs);
  

router
  .post('/upload/xlsx', 
    multer({ dest: 'temp/'})
    .single('file'), 
    controller.UploadFormatXlxs);


router
  .get("/generate",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.generateCodeVendor
  );

router
  .post("/add",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.create
  );

router
  .get("/list",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.getAll
  );
router
  .get("/listbyproduct",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.getVendorByProduct
  );

router
  .get("/:id",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.getById
  );

router
  .patch("/edit/:id",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.update
  );

router
  .patch("/deleteflag/:id",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.deleteFlag
  );
  
router
  .delete("/delete/id",
    [passport.authenticate("jwt", { session: false}), middleware.isAdmin],
    controller.delete
  );


module.exports = router;
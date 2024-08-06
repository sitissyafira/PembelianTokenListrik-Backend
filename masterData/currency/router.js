const express = require('express');
const passport = require('passport');
const middleware = require('../../middleware/userrole');
const controller = require('./controller');
const multer = require("multer");

const router = express.Router();


  router
  .post('/upload/xlsx', 
    multer({ dest: 'temp/'})
    .single('file'), 
    controller.UploadFormatXlxs);

  router
  .post('/add',[
      passport.authenticate('jwt', {session: false}), 
      middleware.isAdmin
    ], controller.create);

  router
  .get('/excel/export' ,[], controller.DownloadFormatXlxs);

  router
  .get('/list',[
      passport.authenticate('jwt', {session: false}), 
      middleware.isAdmin
    ], controller.GetAll);

  router
  .post('/add',[
      passport.authenticate('jwt', {session: false}), 
      middleware.isAdmin
    ], controller.create);

  router
  .get('/:id',[
      passport.authenticate('jwt', {session: false}), 
      middleware.isAdmin
    ], controller.GetById);

  router
  .patch('/edit/:id',[
      passport.authenticate('jwt', {session: false}), 
      middleware.isAdmin
    ], controller.update);

    router
  .patch('/deleteflag/:id',[
      passport.authenticate('jwt', {session: false}), 
      middleware.isAdmin
    ], controller.DeleteFlag);

  router
  .delete('/delete/:id',[
      passport.authenticate('jwt', {session: false}), 
      middleware.isAdmin    
    ], controller.delete);
 
module.exports = router;
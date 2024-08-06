const express = require('express');
const passport = require('passport');
const middleware = require('../../middleware/userrole');
const controller = require('./controller');

const router = express.Router();

router
.post('/add',[passport.authenticate('jwt', {session: false}), 
 middleware.isAdminFinance], controller.create);

router
.get('/list',[passport.authenticate('jwt', {session: false}), 
 middleware.isAdminFinance], controller.getAll);

router
.patch('/update/:id',[passport.authenticate('jwt', {session: false}), 
middleware.isAdminFinance], controller.updateBalance);

router
.patch('/deleteflag/:id',[passport.authenticate('jwt', {session: false}), 
middleware.isAdmin], controller.deleteFlag);

router
.get('/export/pdf',[passport.authenticate('jwt', {session: false}), 
 middleware.isAdminFinance], controller.reportpdf);


module.exports = router;
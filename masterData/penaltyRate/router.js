const express = require('express');
const passport = require('passport');
const middleware = require('../../middleware/userrole');
const controller = require('./controller');

const router = express.Router();

router
  .route('/')
  .get([passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.getAll)
  .post([passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.create);

router
  .route('/:id')
  .get([passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.getById)
  .patch([passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.update)
  .delete([passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.delete);

module.exports = router;
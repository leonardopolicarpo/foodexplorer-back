const { Router } = require('express');
const usersRoutes = Router();

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const UsersController = require('../controllers/UsersController');
const usersController = new UsersController();

usersRoutes.post('/', usersController.create);
usersRoutes.put('/:id', ensureAuthenticated, usersController.update);

module.exports = usersRoutes;
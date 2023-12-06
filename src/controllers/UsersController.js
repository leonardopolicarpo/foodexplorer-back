const { hash, compare } = require('bcryptjs');
const AppError = require('../utils/AppError');

const knex = require('../database/knex');

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;
    
  }
}

module.exports = UsersController;
const { hash, compare } = require('bcryptjs');
const AppError = require('../utils/AppError');

const knex = require('../database/knex');

class UsersController {
  async create(req, res) {
    try {
      const { name, email, password, isAdmin } = req.body;
    
      if (!name || !email || !password) throw new AppError('Campos incompletos, verifique e tente novamente');

      if (password.lenght < 6) throw new AppError('A senha deve conter no mínino 6 caracteres')

      const verifyUserExist = await knex('users').where({ email }).first();

      if (verifyUserExist) throw new AppError('E-mail já cadastrado!')

      const hashedPassword = await hash(password, 8);

      await knex('users').insert({
        name,
        email,
        password: hashedPassword,
        isAdmin: isAdmin ? 1 : 0,
      })

      return res.status(201).json();
    } catch (error) {
      console.log(error)
      res.json(error)
    }
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const user_id = req.params.id;

    const user = await knex('users').where({ id: user_id }).first();

    if (!user) throw new AppError('Usuário não encontrado, verique os dados informados!')

    let userUpdateEmail;

    if (!email) {
      userUpdateEmail = await knex('users').where({ email: user.email })
    } else {
      userUpdateEmail = await knex('users').where({ email }).first()
    }

    if (userUpdateEmail && userUpdateEmail.id !== user.id) throw new AppError('E-mail já está em uso')

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) throw new AppError('Informe a senha antiga!')

    if (password && old_password) {
      const verifyPasswords = await compare(old_password, user.password);
      if (!verifyPasswords) throw new AppError('Senhas diferentes! Verifique e tente novamente')
      user.password = await hash(password, 8);
    }

    await knex("users").update({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: knex.fn.now()
    }).where({ id: user.id});

    return res.status(200).json()
  }
}

module.exports = UsersController;
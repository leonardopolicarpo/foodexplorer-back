const knex = require('knex');
const AppError = require('../utils/AppError');
const DiskStorage = require('../providers/DiskStorage');

class DishesController {
  async create(req, res) {
    try {
      const { name, description, category, price, ingredients } = req.body;
      const user_id = req.params.id;
      let img = null;
      let filename = null;
      const diskStorage = new DiskStorage();

      if(!name && !description && !category && !price && !ingredients) {
        throw new AppError('Campos incompletos! Verifique e tente novamente')
      }

      const user = await knex('users').where({ id: user_id}).first();
      const isAdmin = user.isAdmin === 1;
      if(!isAdmin) {
        throw new AppError('Usuário não autorizado, solicite ao administrador')
      } else {
        if (req.file) {
          img = req.file.filename;
          filename = await diskStorage.saveFile(img);
        }
        const [ dish_id ] = await knex('dishes').insert({
          name, description, category, price, image: img ? filename : null, created_by: user_id, updated_by: user_id
        })
        const ingredientsInserted = JSON.parse(ingredients).map(ingredient => {
          return {
            dish_id, name
          }
        })
        await knex('ingredients').insert(ingredientsInserted)
      }
      return res.status(201).json()
    } catch (error) {
      console.log(error)
      throw new AppError(error)
    }
  }

  async update(req, res) {
    try {
      
    } catch (error) {
      console.log(error)
      throw new AppError(error)
    }
  }
}

module.exports = DishesController;
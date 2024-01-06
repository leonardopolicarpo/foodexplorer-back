const knex = require('knex');
const AppError = require('../utils/AppError');
const DiskStorage = require('../providers/DiskStorage');

class DishesController {
  async index(req, res) {
    const { search } = req.query;
    const dishes = await knex.select('dishes.*')
      .from('dishes')
      .innerJoin('ingredients', 'dishes.id', '=', 'ingredients.dish_id')
      .whereLike('dishes.name', `%${search}%`)
      .orWhereLike('ingredients.name', `%${search}%`)
      .groupBy('dishes.name');

    return res.status(200).json({ dishes });
  }

  async show(req, res){
    const { id } = req.params;
    const dish = await knex('dishes').where({ id }).first();
    if (!dish) throw new AppError('Prato não encontrado');
    const ingredients = await knex('ingredients').where({ dish_id: id}).orderBy('name');
    return res.json({
      ...dish,
      ingredients
    });
  }

  async create(req, res) {
    try {
      const { name, description, category, price, ingredients } = req.body;
      const user_id = req.user.id;
      let img = null;
      let filename = null;
      const diskStorage = new DiskStorage();

      if(!name && !description && !category && !price && !ingredients) {
        throw new AppError('Campos incompletos! Verifique e tente novamente');
      };

      const user = await knex('users').where({ id: user_id}).first();
      const isAdmin = user.isAdmin === 1;
      if(!isAdmin) {
        throw new AppError('Usuário não autorizado, solicite ao administrador')
      } else {
        if (req.file) {
          img = req.file.filename;
          filename = await diskStorage.saveFile(img);
        };
        const [ dish_id ] = await knex('dishes').insert({
          name, description, category, price, image: img ? filename : null, created_by: user_id, updated_by: user_id
        });
        const ingredientsInserted = JSON.parse(ingredients).map(ingredient => {
          return {
            dish_id, ingredient
          };
        });
        await knex('ingredients').insert(ingredientsInserted);
      }
      return res.status(200).json();
    } catch (error) {
      console.log(error);
      throw new AppError(error);
    }
  }

  async update(req, res) {
    try {
      const { name, description, category, price, ingredients } = req.body;
      const user_id = req.user.id;
      const { id } = req.params;
      let img = null;
      let filename = null;
      const diskStorage = new DiskStorage();

      if(!name && !description && !category && !price && !ingredients) {
        throw new AppError('Campos incompletos! Verifique e tente novamente');
      }

      const user = await knex('users').where({ id: user_id}).first();
      const isAdmin = user.isAdmin === 1;
      if(!isAdmin) {
        throw new AppError('Usuário não autorizado, solicite ao administrador')
      } else {
        const dish = await knex('dishes').where({ id }).first();
        filename = dish.image;
        if (req.file) {
          dish.image && await diskStorage.deleteFile(dish.image);
        };
        img = req.file.filename;
        filename = await diskStorage.saveFile(img);

        await knex('dishes').where({ id }).update({
          name, description, category, price, image: filename, updated_at: knex.fn.now()
        })
        const ingredientsInserted = JSON.parse(ingredients).map(ingredient => {
          return {
            dish_id: id, ingredient
          };
        })
        await knex('ingredients').where({ dish_id: id }).delete();
        await knex('ingredients').insert(ingredientsInserted);
      }
    } catch (error) {
      console.log(error);
      throw new AppError(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const user = await knex('users').where({ id: user_id}).first();
      const isAdmin = user.isAdmin === 1;

      if(!isAdmin) {
        throw new AppError('Usuário sem permissão, solicite ao administrador');
      } else {
        await knex('dishes').where({ id }).delete();
      }
      return res.json();
    } catch (error) {
      console.log(error);
      throw new AppError(error);
    }
  }
}

module.exports = DishesController;
const multer = require('multer');
const { Router } = require('express');
const dishesRoutes = Router()

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const uploadConfig = require('../configs/upload');
const upload = multer(uploadConfig.MULTER)

const DishesController = require('../controllers/DishesController');
const dishesController = new DishesController();

dishesRoutes.use(ensureAuthenticated);
dishesRoutes.get('/', dishesController.index);
dishesRoutes.get('/:id', dishesController.show);
dishesRoutes.post('/', upload.single('image'), dishesController.create);
dishesRoutes.put('/:id', upload.single('image'), dishesController.update);
dishesRoutes.delete('/:id', dishesController.delete);

module.exports = dishesRoutes;
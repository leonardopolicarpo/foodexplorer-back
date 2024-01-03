require('express-async-errors');
require('dotenv/config');

const express = require('express');
const cors = require('cors');

const AppError = require('./utils/AppError');
// const uploadConfig = require('./configs/upload');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(cors());

app.use(routes);

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
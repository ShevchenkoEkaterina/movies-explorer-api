require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./utils/limiter');
const mongodb = require('./utils/mongodb');
const router = require('./routes/index');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(mongodb);
mongoose.set('strictQuery', false);

app.use(requestLogger);

app.use(limiter);
app.use(helmet());
app.use(express.json());

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

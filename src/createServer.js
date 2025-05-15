'use strict';

const express = require('express');
const { router: userRouter } = require('./services/users.service.js');
const { router: expenseRouter } = require('./services/expenses.service.js');

function createServer() {
  const app = express();

  app.use(express.json());

  app.use('/users', userRouter);
  app.use('/expenses', expenseRouter);

  return app;
}

module.exports = { createServer };

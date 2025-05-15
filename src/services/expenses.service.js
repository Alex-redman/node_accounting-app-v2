const express = require('express');
const router = express.Router();

const expenses = [];
const { users } = require('./users.service');

router.get('/', (req, res) => {
  const { userId, from, to, categories, category } = req.query;

  let filteredExpenses = expenses;

  if (userId) {
    filteredExpenses = filteredExpenses.filter(
      (e) => e.userId === parseInt(userId, 10),
    );
  }

  if (from && to) {
    filteredExpenses = filteredExpenses.filter(
      (e) =>
        new Date(e.spentAt) >= new Date(from) &&
        new Date(e.spentAt) <= new Date(to),
    );
  } else if (category) {
    filteredExpenses = filteredExpenses.filter((e) => e.category === category);
  } else if (categories) {
    filteredExpenses = filteredExpenses.filter(
      (e) => e.category === categories,
    );
  }

  res.json(filteredExpenses);
});

router.post('/', (req, res) => {
  const { userId, spentAt, title, amount, category, note } = req.body;

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  if (!userId) {
    return res.status(400).json({});
  }

  const expense = {
    id: expenses.length + 1,
    userId,
    spentAt,
    title,
    amount,
    category,
    note,
  };

  expenses.push(expense);
  res.status(201).json(expense);
});

router.get('/:id', (req, res) => {
  const expense = expenses.find((e) => e.id === parseInt(req.params.id, 10));

  if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  res.json(expense);
});

router.patch('/:id', (req, res) => {
  // Keep 'patch' to match your test
  const id = parseInt(req.params.id, 10);
  const expenseIndex = expenses.findIndex((e) => e.id === id);

  if (expenseIndex === -1) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  const { userId, spentAt, title, amount, category, note } = req.body;

  expenses[expenseIndex] = {
    ...expenses[expenseIndex],
    ...(userId !== undefined && { userId }),
    ...(spentAt !== undefined && { spentAt }),
    ...(title !== undefined && { title }),
    ...(amount !== undefined && { amount }),
    ...(category !== undefined && { category }),
    ...(note !== undefined && { note }),
  };

  res.json(expenses[expenseIndex]);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = expenses.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  expenses.splice(index, 1);
  res.status(204).end();
});

module.exports = { router };

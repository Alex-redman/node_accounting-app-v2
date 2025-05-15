const express = require('express');
const router = express.Router();

const users = [];
let nextUserId = 1;

router.get('/', (req, res) => {
  res.json(users);
});

router.post('/', (req, res) => {
  const { name, email, phone } = req.body;

  if (!name) {
    return res.status(400).json({});
  }

  const newUser = {
    id: nextUserId++,
    name,
    email,
    phone,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

router.get('/:id', (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id, 10));

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

router.patch('/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, email, phone } = req.body;

  users[userIndex] = {
    ...users[userIndex],
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(phone !== undefined && { phone }),
  };
  res.json(users[userIndex]);
});

router.delete('/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  users.splice(index, 1);
  res.status(204).end();
});

module.exports = {
  router,
  users,
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then(() => {
      res.status(201).send({
        user: {
          email, name,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Введенные данные некорректны'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email-адресом уже существует'));
      } else next(err);
    });
};

module.exports.logIn = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch((err) => {
      if (err.message === 'Unauthorized') {
        next(new UnauthorizedError('Не удалось авторизоваться'));
      } else next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send({ user }))
    .catch(next);
};

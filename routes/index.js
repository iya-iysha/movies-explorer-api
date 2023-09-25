const router = require('express').Router();
const authorization = require('../middlewares/authorization');
const { createUser, logIn } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { validateCreateUser, validateLogIn } = require('../middlewares/validation');

router.use('/users', authorization, require('./users'));
router.use('/movies', authorization, require('./movies'));

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogIn, logIn);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;

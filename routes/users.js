const router = require('express').Router();
const {
  modifyUser, getUserInfo,
} = require('../controllers/users');
const { profileValidator } = require('../middlewares/validator');

router.get('/me', getUserInfo);
router.patch('/me', profileValidator, modifyUser);

module.exports = router;

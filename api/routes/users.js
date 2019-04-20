const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
const checkLogin = require('../middleware/check-login');



router.post('/register', UsersController.users_post_register );

router.post('/login', UsersController.users_post_login);

router.delete('/:userId', checkLogin,UsersController.users_delete_userById);


module.exports = router;
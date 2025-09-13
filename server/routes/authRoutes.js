const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.route('/register').post(validate('userRegister'), registerUser);
router.route('/login').post(validate('userLogin'), loginUser);

module.exports = router;
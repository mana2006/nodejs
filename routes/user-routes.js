const express = require('express');
const { userSignup, userSignin, beforeSignup, beforeSignin } = require('../controllers/userController');

const router = express.Router();

router.post('/auth/before_signup', beforeSignup);

router.post('/auth/signup', userSignup);

router.post('/auth/signin', userSignin);

router.post('/auth/before_signin', beforeSignin);

module.exports = {
    routes: router
}

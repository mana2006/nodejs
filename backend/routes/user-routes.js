const express = require('express');
const {beforeSignup,
    userSignup,
    beforeSignin,
    userSignin} = require('../controllers/authController');

const router = express.Router();

router.post('/auth/before_signup', beforeSignup);

router.post('/auth/signup', userSignup);

router.post('/auth/signin', userSignin);

router.post('/auth/before_signin', beforeSignin);

module.exports = {
    routes: router
}

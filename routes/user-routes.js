const express = require('express');
const { userSignup, userSignin } = require('../controllers/userController');

const router = express.Router();


router.post('/auth/signup', userSignup);

router.post('/auth/signin', userSignin);

module.exports = {
    routes: router
}

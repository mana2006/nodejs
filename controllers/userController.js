'use strict';

const firebase = require('../db');
const User = require('../models/user');
const firestore = firebase.firestore();
const {collection, query, where } = require("firebase/firestore");
const db = require("../db");
const functionCommon = require('../utils/common_function');

const userSignup = async (req, res, next) => {
    try {
        const data = req.body;
        if (!functionCommon.validateEmail(data.email)) {
            res.status(404).send('Email invalid, please try agains!');
        }

        const users = await firestore.collection('users');
        const userData = await users.where('email', '==', data.email).get();
        if (userData.empty) {
            const data_auth = {
                auth_code: functionCommon.makeid(10),
                email: data.email
            }
            await firestore.collection('users').doc().set(data_auth);
        } else {
            res.status(404).send('Email existed, please choice other email!');
        }
        const user = new User(functionCommon.makeid(10, false), data.email);
        res.send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const userSignin = async (req, res, next) => {
    try {
        const data = req.body;

        const users = await firestore.collection('users');
        const userData = await users.where('email', '==', data.email).get();
        if (!userData.empty) {
            const data_auth = {
                auth_code: functionCommon.makeid(10),
                email: data.email
            }
            await firestore.collection('auth_users').doc().set(data_auth);
        } else {
            res.status(404).send('No user record found!');
        }
        res.send('Record saved successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}


// const addUser = async (req, res, next) => {
//     try {
//         const data = req.body;
//         await firestore.collection('users').doc().set(data);
//         res.send('Record saved successfully');
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

module.exports = {
    userSignup,
    userSignin,
}

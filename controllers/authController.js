'use strict';

const firebase = require('../db');
const firestore = firebase.firestore();
const User = require('../models/user');
const functionCommon = require('../utils/common_function');
const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');

let auth_code_email_signup;
let auth_code_email_signin;


const sendAuth = async (data, auth_code) => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    await transporter.sendMail({
        from: 'no-reply@example.com',
        to: data.email,
        subject: 'Verification Code',
        html: auth_code
    })
}

const beforeSignup = async (req, res, next) => {
    const data = req.body;
    if (!functionCommon.validateEmail(data.email)) {
        return res.status(404).send('Email invalid, please try agains!');
    }

    const users = await firestore.collection('users');
    const userData = await users.where('email', '==', data.email).get();
    if (userData.empty) {
        auth_code_email_signup = functionCommon.makeid(10)
        await sendAuth(data, auth_code_email_signup);
        res.send('Send auth code successfully');
    } else {
        res.status(404).send('Email existed, please choice other email!');
    }
}

const userSignup = async (req, res, next) => {
    try {
        const data = req.body;
        if (!functionCommon.validateEmail(data.email)) {
            return res.status(404).send('Email invalid, please try agains!');
        }

        const users = await firestore.collection('users');
        const userData = await users.where('email', '==', data.email).get();
        const userId = functionCommon.makeid(10, false);
        if (userData.empty) {
            if (auth_code_email_signup == data.verify_code) {
                const data_auth = {
                    id: userId,
                    auth_code: auth_code_email_signup,
                    email: data.email
                }
                await firestore.collection('users').doc(userId).set(data_auth);
            }
        } else {
            return res.status(404).send('Email existed, please choice other email!');
        }
        const user = new User(userId, data.email);
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const beforeSignin = async (req, res, next) => {
    const data = req.body;
    if (!functionCommon.validateEmail(data.email)) {
        return res.status(404).send('Email invalid, please try agains!');
    }

    const users = await firestore.collection('users');
    const userData = await users.where('email', '==', data.email).get();
    if (!userData.empty) {
        let userInfo = {};
        userData.forEach(doc => {
            userInfo = {
                email: doc.data().email,
                auth_code: doc.data().auth_code
            }
        });
        auth_code_email_signin = userInfo.auth_code;
        await sendAuth(userInfo, userInfo.auth_code);
        return res.send('Send auth code successfully');
    } else {
        return res.status(404).send('Email existed, please choice other email!');
    }
}

const userSignin = async (req, res, next) => {
    try {
        const data = req.body;
        if (!functionCommon.validateEmail(data.email)) {
            return res.status(404).send('Email invalid, please try agains!');
        }
        const users = await firestore.collection('users');
        const userData = await users.where('email', '==', data.email).where('auth_code', '==', auth_code_email_signin).get();

        if (!userData.empty) {
            let userInfo = {};
            userData.forEach(doc => {
                userInfo = {
                    id: doc.id,
                    email: doc.data().email,
                    auth_code: doc.data().auth_code
                }
            });
            const token = jwt.sign({ userInfo }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
            res.send({ accessToken: token });
        } else {
            return res.status(401).send('Auth Code wrong!');
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    beforeSignup,
    userSignup,
    beforeSignin,
    userSignin
};

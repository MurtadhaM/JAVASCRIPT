const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');


const Login = (req, res) => {
     
    const { email, password } = req;
    User.findOne
    ({ email

    }, (err, user) => {

        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect email' });
        }

        console.log(user);
    });
}

exports.Login = Login;
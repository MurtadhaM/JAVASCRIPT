// This is the Middleware that will be used to authenticate the user.

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');


const auth = () => {
    // Define passport middleware   

    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    
        User.findOne({
            email
        }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect email' });
            }
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) {
                    return done(err);
                }
                if (res === false) {
                    return done(null, false, { message: 'Incorrect password' });
                }
                return done(null, user);
            });
        });
    }
    ));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    }
    );
    passport.deserializeUser((id, done) => {
         done(null, user.id);
    }
    );
};


// Redirect the user to the login page if they are not authenticated
const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/login');
}

// Redirect the user to the profile page if they are already authenticated
const isNotAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/user/profile');
    }
    next();
}

module.exports = { auth, isAuth, isNotAuth };
    
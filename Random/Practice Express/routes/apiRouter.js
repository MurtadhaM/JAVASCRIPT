const jwt = require('jsonwebtoken')
const User = require('../models/User')
const JWT_SECRET = 'secret'
const app = require('express')()
const bcrypt = require('bcrypt')
/**
 *  ROUTES 
 */


// Generate a token
const generateToken = (user) => {
    return jwt.sign({
        id: user._id,

    }, JWT_SECRET, {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
    });
}

// Verify the token
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({
            auth: false,
            message: 'No token provided.'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });
        }

        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
}


 
app.put('/Authenticate', (req, res) => {

    // Check if authorization header is set
    if (req.headers.authorization) {
        // Authorization header is set
        // Split at the space
        const bearer = req.headers.authorization.split(' ');
        // Get token from array
        const token = bearer[1];
        // Set the token
        req.token = token;
        // Next middleware
        
    } else {
        // Forbidden
        console.log(req.headers)
        res.sendStatus(403);
    }


  
  
});




/** Service: Login */

app.post('/users/Login', (req, res) => {


      controller.login(req.body.email, req.body.password)   
        .then(user => {     
            if (user) {
                req.session.user = user;
                res.redirect('/profile');
            } else {
                res.redirect('/Login');

            }
        })
        .catch(err => {
            res.redirect('/Login');
        });
});


/** Service: Register */

app.post('/users/Register', (req, res) => { 
    const { email, password } = req
    User.findOne
    ({ email
    }, (err, user) => {
                 
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, { message: 'User already exists' });
            
        }
        bcrypt.hash(password, 10, (err, hash) => {  
            if (err) {
                return done(err);

            }
            const newUser = new User({
                email: email,
                password: hash
            });
            newUser.save((err) => {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            });
        });
    }
    );
}

);


/** Service: Logout */

app.get('/users/Logout', (req, res) => {

    req.logout();
    res.redirect('/');
}
);

/** Service: Profile */

app.get('/users/Profile', (req, res) => {
    res.render('profile.ejs', { name: req.session.user.username });
}
);

/** Service: Profile */

// JWT Authentication
 

app.all('*',  (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {

        return res.status(401).json({ error: "You must be logged in" })

    }
    
     token = authorization.replace("Bearer ", "")
 
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {

            return res.status(401).json({ error: "You must be logged in" })
        }
        const { _id } = payload
                User.findById(_id).then(userData => {
                    req.user = userData

                    next()
                })
    })
}

);

    

// JWT Authentication



/**  Authentication 
 * 
*/


module.exports = app

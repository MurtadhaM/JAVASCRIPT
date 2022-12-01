const router = require('express').Router() 



/*
users/Register
users/Login
users/Logout
users/Profile
*/


const userController = require('../controllers/userController');





router.route('/Login').get((req, res) => {
    res.render('login')
}
).post((req, res) => {
    

    console.log(req.body);

    userController.Login(req, res)
}
).put((req, res) => {
    res.send('Login')
}
    
 
) 



router.route('/Logout').get((req, res) => {
    res.render('logout')
}
).post((req, res) => {
    res.send('Logout')
}
).put((req, res) => {
    res.send('Logout')
}

)


router.route('/Profile').get((req, res) => {
    res.render('profile')
}
).post((req, res) => {

    res.send('Profile')
}
).put((req, res) => {
    res.send('Profile')
}
)


module.exports =  router



// Defining the Main Router
const route = require('express').Router()



// Defining the index, contact, and about routes
route.get('/', (req, res) => {
    res.render('index')
}
)


route.get('/contact', (req, res) => {
    res.render('contact')
}

)

route.get('/about', (req, res) => {
    res.render('about')
}

)

route.get('/login', (req, res) => {
    res.redirect('/user/login')
} );

// Unknow routes
route.get('*', (req, res) => {
    res.render('404')
}
)

        

// Exporting the Main Router
module.exports = route

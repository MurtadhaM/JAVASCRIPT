const session = require('express-session');
const toastify = require('toastify-js');
const auth  = require('./middleware/Authentication'); 
// Importing the routes
const mainRouter = require('./routes/mainRouter');
const userRouter = require('./routes/userRouter');
const apiRouter = require('./routes/apiRouter');
const app = require('express')();

const path = require('path');
const express = require('express');
const port = 3000;
// ENVIRONMENT VARIABLES
const env = process.env;
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));




app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: env.MONGO_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


// Import the Database
const db = require('./config/db');

// Connect to the Database
db.connectDB();

//ROUTES
app.use('/user', userRouter);
app.use('/api', apiRouter);
app.use('/', mainRouter);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
}
);

const MakePostRequest = (url, data) => {
    return new Promise((resolve, reject) => {
         const fetch = require('node-fetch');
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
            })
            .then(res => res)
            .then(json => resolve(json))
            .catch(err => reject(err));

            
    });

} 


MakePostRequest('http://localhost:3000/api/Authenticate', { email: 'asdA@asdd.com0', password: 'asdasdasd' })
    .then(data => console.log(data)) // Result from the `response.json()` call  
    .catch(error => console.error(error));


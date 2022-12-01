
// IMPORTING THE DB LIBRARY
const mongoose = require('mongoose');
const { User } = require('../models/User');
const uri = process.env.MONGO_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);

        // Exit process with failure
        process.exit(1);
    }
};

const debugDb = ()=>
{
    mongoose.set('debug', true);
    console.log('Debugging MongoDB...');
    // Print the Database URI
    console.log(uri);
    
      
    //connect to the database
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

    //get reference to database
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    // we're connected! 
    console.log('We are connected to the database');
    // Print the selected database
    console.log(db.name);
    // Print the collection names
    db.db.listCollections().toArray(function(err, names) {
        console.log('The collection names are: ');
      
        names.forEach(function(name) {
            console.log(name.name);
            }
        )
    });
    });
}   




// Export all the functions
module.exports = {
    connectDB,
    debugDb
};

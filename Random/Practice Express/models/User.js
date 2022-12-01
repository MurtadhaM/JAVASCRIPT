 
 const mongoose = require('mongoose');

    
const    UserSchema = new mongoose.Schema({
        username : {String ,
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength : 3
        } ,
        password: {
            type: String,
            required: true,
            trim: true,

        },
        firstname:  {
            type: String,
            required: true,
            trim: true,
            minlength: 3
        },

        date_joined: {
            type: Date,
            required: true,
            default: Date.now
                
        },
      last_login: {
            type: Date,
            required:  true,
            default: Date.now
        },
        is_active: {
            type: Boolean,
            required: true,
            default: true
        },
        image: {
            type: String,
            required: true,
            default: "default.jpg"
        },
    
    });

 
    UserSchema.pre('save', function(next) {
        const

        user    = this;
        const SALT_FACTOR = 5;
        if (!user.isModified('password')) return next();
        bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    });

    UserSchema.methods.comparePassword = function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    };

    module.exports = mongoose.model('User', UserSchema);
    
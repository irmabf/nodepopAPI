'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

/** User Model */

const userSchema= mongoose.Schema({
	name: {
		type: String,
		trim:true,
		index:true
	},
	email:{
		type: String,
		trim:true,
		required: true,
		unique:true,
		index:true
	},
	password:{
		type:String, required:true
	}
});

userSchema.pre('save', function (next) {
	const user= this;
	
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if(err) return next(err);
		bcrypt.hash(user.password, salt, function (err, hash) {
			if(err) return next(err);
			user.password= hash;
			next();
		});
	});
});

userSchema.post('save', function(error, doc, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		const error = new Error('There was a duplicate key error');
		error.status = 409;
		next(error);
	} else {
		next(error);
	}
});


userSchema.methods.comparePassword = function (candidatePassword, cb){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if (err) return cb(err);
		cb(null, isMatch);		
	});
};

userSchema.statics.userByEmail = function(_email){
	return User.findOne({ email: _email}).exec();
};

const User = mongoose.model('User', userSchema);

module.exports = User;

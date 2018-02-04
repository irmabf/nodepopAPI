'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const CustomError = require('../../lib/custom-error');

const { check, validationResult } = require('express-validator/check');
/**
 * POST /
 */
router.post('/', 
	[
		check('email')
			.exists().withMessage('EMAIL_NOT_EXIST')
			.isEmail().withMessage('EMAIL_WRONG_FORMAT'),
		check('password')
			.exists().withMessage('PASSWORD_NOT_EXIST')
	],
	async (req,res,next)=>{
		const errors = validationResult(req);
		if (!errors.isEmpty()) return next(errors);

		const email = req.body.email;
		const password = req.body.password;

		await User.userByEmail(email)
			.then((user) => {
				if (user == null) return next(CustomError(res.__('USER_NOT_FOUND'), 404));
				user.comparePassword(password,function(err, isMatch){
					if (err) return console.log('Authentication error');
					if (!isMatch) return next(CustomError(res.__('INVALID_CREDENTIALS'),401));	
					jwt.sign({user_id: user._id}, process.env.JWT_SECRET,{
						expiresIn: process.env.JWT_EXPIRES_IN
					}, (err, token) => {
						if (err) return next(err);
						res.json({ success: true, token: token });
					});
				});
			});
	});

/**
 * POST /new
 */
router.post('/new', 
	[
		check('name')
			.exists().withMessage('NAME_NOT_EXIST'),
		check('email')
			.exists().withMessage('EMAIL_NOT_EXIST')
			.isEmail().withMessage('EMAIL_WRONG_FORMAT'),
		check('password')
			.exists().withMessage('PASSWORD_NOT_EXIST')
	],
	(req,res,next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return next(errors);
		// creamos un agente en memoria
		const user= new User(req.body);
		// lo persistimos en la colección de agentes
		user.save((err, userSaved)=>{
			if (err) return next(err);
			res.json({success: true, result: userSaved});
		});
	});

module.exports = router;

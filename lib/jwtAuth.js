'use strict';

const jwt = require('jsonwebtoken');
const CustomError = require('./custom-error.js');

//exportamos un creador de MD de autenticacion
module.exports = () => {
	return function(req, res, next) {
		// leer credenciales (del body, de la cabecera o de query)
		const token = req.body.token || req.query.token || 
		req.get('x-access-token');
		
		// Si no se ha aportado token se envía error
		if (!token) return next(CustomError(res, 'NO_TOKEN_PROVIDED', 401));
		
		// Si el token no está expirado o no ha sido modificado se guarda el user_id 
		// en la Req para los siguientes MW
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
			if (err) return next(CustomError(res, 'INVALID_TOKEN', 401));
			req.userId = decoded.user_id; 
			next();
		});
	};
};

//$2a$10$bLXM07/h.DQTsjw4O5GaP.ezZEocUJRQhWvXvA1tJ3PtOWxjyjomS
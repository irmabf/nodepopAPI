'use strict';

const mongoose = require('mongoose');

//Fist: create schema
const adSchema = mongoose.Schema({
	name : { 
		type: String,
		trim:true,
		index: true
	},
	forSale : {
		type: Boolean,
		index: true
	},
	price : {
		type: Number,
		index: true
	},
	photo : String,
  tags : [String],
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
});

adSchema.set('autoIndex', true);

// Creamos un metodo estatico
adSchema.statics.list = (filters,limit, skip,sort,fields)=>{
	//obtenemos la query sin ejecutarla
	const query = Add.find(filters);
	query.limit(limit);
	query.skip(skip);
	query.sort(sort);
	query.select(fields);
	//ejecutammos la query y devolvemos una promesa
	//console.log('limit: '+limit+' skip: '+skip);
	return query.exec();
};


//Second create model
const Add= mongoose.model('Ad',adSchema);

//Export model
module.exports = Add;
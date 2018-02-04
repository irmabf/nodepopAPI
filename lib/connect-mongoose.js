'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;



mongoose.Promise = global.Promise;

conn.on('error', err =>{
  console.log('Error', err);
  process.exit(1);
}); 

conn.once('open', ()=>{
  console.log(`Conectado a MongoDB en ${mongoose.connection.name}`);
});

//mongoose.connect('mongodb://localhost/apinodepop');

/*mongoose.connect('mongodb://' + process.env.MONGO_HOST + '/' + process.env.MONGO_DATABASE, {
    //user: process.env.MONGO_USER,
    //pass: process.env.MONGO_PASS
});*/



mongoose.connect(`mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE_NAME}`);
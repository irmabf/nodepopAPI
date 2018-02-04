'use strict';
require('dotenv').config();
const fs = require('fs');

require('../lib/connect-mongoose');


const mongoose = require('mongoose');
//mongoose.connect(process.env.DATABASE);
//mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// import all of our models - they need to be imported only once
const User = require('../models/User');
const Ad = require('../models/Ad');

const ads = JSON.parse(fs.readFileSync(__dirname + '/ads.json', 'utf-8'));

const users = JSON.parse(fs.readFileSync(__dirname + '/users.json', 'utf-8'));

async function deleteData() {
  console.log('Goodbye Data...');
  await Ad.remove();
  await User.remove();
  console.log('Data Deleted. To load sample data, run\n\n\t npm run sample\n\n');
  process.exit();
}

async function loadData() {
  try {
    await Ad.insertMany(ads);
    await User.insertMany(users);
    console.log('Done!');
    process.exit();
  } catch(e) {
    console.log('\nError! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n');
    console.log(e);
    process.exit();
  }
}
if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}

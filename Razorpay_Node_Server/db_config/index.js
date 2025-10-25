const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.MONGO_CONNECTION_STRING;

async function connectToDB() {
  try {
    const mongo = mongoose.connect(uri);
    return mongo;
  } catch (error) {
    console.log('Failed to connect to mongo server', error.message.red);
    throw new Error(error.message);
  }
}

module.exports = connectToDB;
require('dotenv').config();
const { Client } = require('pg');

console.log('DB_USER:', process.env.DB_USER); // Debug line
console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // Debug line

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });


  client.connect()
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Connection error', err.stack));

module.exports = client;
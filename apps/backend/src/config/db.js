const pgp = require('pg-promise')();
const config = require('./index');

const db = pgp(config.db);

db.connect()
    .then(obj => {
        console.log('Connected to the database successfully: ' + obj.client.database);
        obj.done();
    })
    .catch(error => {
        console.error('Error connecting to the database:', error);
    });

module.exports = db;
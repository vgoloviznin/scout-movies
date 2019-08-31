const path = require('path');

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(process.cwd(), 'data', process.env.DB_NAME)
  },
  useNullAsDefault: true
});

module.exports = knex;

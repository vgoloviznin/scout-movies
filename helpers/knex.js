const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './data/movies.sqlite'
  },
  useNullAsDefault: true
});

module.exports = knex;

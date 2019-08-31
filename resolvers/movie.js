const { knex } = require('../helpers');

module.exports = {
  Query: {
    movies: async () => {
      const movies = await knex('movies');

      return movies;
    }
  }
};

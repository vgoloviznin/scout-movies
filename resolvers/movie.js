const faker = require('faker');
const { knex } = require('../helpers');

module.exports = {
  Query: {
    movies: async () => {
      const movies = await knex('movies');

      return movies;
    }
  },
  Movie: {
    actors: (movie, _, { loaders }) => loaders.actorsByMovieIDs.load(movie.id),
    scoutbase_rating: (_, __, { isLoggedIn }) => {
      if (isLoggedIn) {
        return faker.random.number({ min: 5, max: 9, precision: 0.1 }).toFixed(1);
      }
    }
  }
};

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
    actors: async (movie) => {
      const actors = await knex('actors')
        .select('actors.*')
        .innerJoin('movie_actor', 'movie_actor.actor_id', 'actors.id')
        .where('movie_actor.movie_id', movie.id);

      return actors;
    },
    scoutbase_rating: (_, __, { isLoggedIn }) => {
      if (isLoggedIn) {
        return faker.random.number({ min: 5, max: 9, precision: 0.1 }).toFixed(1);
      }
    }
  }
};

const { knex } = require('../helpers');

module.exports = {
  actorsByMovieIDs: async (movieIDs) => {
    const actors = await knex('actors')
      .select('actors.*', 'movie_id')
      .innerJoin('movie_actor', 'movie_actor.actor_id', 'actors.id')
      .whereIn('movie_actor.movie_id', movieIDs);

    return movieIDs.map(movieID => actors.filter(actor => actor.movie_id === movieID));
  }
};

const DataLoader = require('dataloader');
const { knex } = require('../helpers');

const directorLoader = async (actorIDs) => {
  const directors = await knex('directors')
    .select('directors.*', 'actor_id')
    .innerJoin('actor_director', 'actor_director.director_id', 'directors.id')
    .whereIn('actor_director.actor_id', actorIDs);

  return actorIDs.map(actorID => directors.filter(director => director.actor_id === actorID));
};

const actorLoader = async (movieIDs) => {
  const actors = await knex('actors')
    .select('actors.*', 'movie_id')
    .innerJoin('movie_actor', 'movie_actor.actor_id', 'actors.id')
    .whereIn('movie_actor.movie_id', movieIDs);

  return movieIDs.map(movieID => actors.filter(actor => actor.movie_id === movieID));
};

module.exports = {
  directorsByActorIDs: new DataLoader(directorLoader, { cache: false }),
  actorsByMovieIDs: new DataLoader(actorLoader, { cache: false }),
};

const { knex } = require('../helpers');

module.exports = {
  directorsByActorIDs: async (actorIDs) => {
    const directors = await knex('directors')
      .select('directors.*', 'actor_id')
      .innerJoin('actor_director', 'actor_director.director_id', 'directors.id')
      .whereIn('actor_director.actor_id', actorIDs);

    return actorIDs.map(actorID => directors.filter(director => director.actor_id === actorID));
  }
};

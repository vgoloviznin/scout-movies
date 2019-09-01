const { knex } = require('../helpers');

module.exports = {
  Actor: {
    directors: async (actor) => {
      const directors = await knex('directors')
        .select('directors.*')
        .innerJoin('actor_director', 'actor_director.director_id', 'directors.id')
        .where('actor_director.actor_id', actor.id);

      return directors;
    }
  }
};

const DataLoader = require('dataloader');
const { knex } = require('knex');

module.exports = {
  directorsByActorIDs: new DataLoader(async (keys) => {
    const directors = await knex('directors')
      .select('directors.*')
      .innerJoin('actor_director', 'actor_director.director_id', 'directors.id')
      .whereIn('actor_director.director_id', keys);

    return keys.map(key => directors.find(user => user.id === key));
  })
};

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const faker = require('faker');

exports.seed = async (knex) => {

  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('movies');
  await knex.schema.dropTableIfExists('actors');
  await knex.schema.dropTableIfExists('directors');
  await knex.schema.dropTableIfExists('movie_actor');
  await knex.schema.dropTableIfExists('actor_director');


  // const movies = Array(10).map(() => ({
  //   title: faker.random.words,
  //   year: faker.random.number(1900, 2019),
  //   rating: faker.random.number(1, 5),
  // }));

  // const directors = Array(10).map(() => ({
  //   name: faker.name,
  //   birthday: faker.date.past
  // }));

  // const actors = Array(10).map(() => ({
  //   name: faker.name,
  //   birthday: faker.date.past
  // }));

  // await knex('movie').insert(movies);
  // await knex('actor').insert(actors);
  // await knex('director').insert(directors);


};

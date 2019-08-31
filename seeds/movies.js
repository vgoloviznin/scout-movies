/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const faker = require('faker');

exports.seed = async (knex) => {
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('movies');
  await knex.schema.dropTableIfExists('actors');
  await knex.schema.dropTableIfExists('directors');
  await knex.schema.dropTableIfExists('movie_actor');
  await knex.schema.dropTableIfExists('actor_director');

  await knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('username', 512).notNullable();
    table.string('password').notNullable();
    table.unique('username');
  });

  await knex.schema.createTable('actors', (table) => {
    table.increments('id');
    table.string('name', 512).notNullable();
    table.date('birthday').notNullable();
    table.string('country', 512);
  });

  await knex.schema.createTable('directors', (table) => {
    table.increments('id');
    table.string('name', 512).notNullable();
    table.date('birthday').notNullable();
    table.string('country', 512);
  });

  await knex.schema.createTable('movies', (table) => {
    table.increments('id');
    table.string('title', 512).notNullable();
    table.integer('year').notNullable();
    table.date('rating').notNullable();
  });

  await knex.schema.createTable('movie_actor', (table) => {
    table.increments('id');
    table.integer('movie_id').notNullable();
    table.integer('actor_id').notNullable();

    table.foreign('movie_id').references('id').inTable('movies');
    table.foreign('actor_id').references('id').inTable('actors');
  });

  await knex.schema.createTable('actor_director', (table) => {
    table.increments('id');
    table.integer('actor_id').notNullable();
    table.integer('director_id').notNullable();
    table.foreign('actor_id').references('id').inTable('actors');
    table.foreign('director_id').references('id').inTable('directors');
  });

  const fakeMovies = Array(...Array(10)).map(() => ({
    title: faker.random.words(),
    year: faker.random.number({ min: 1900, max: 2019 }),
    rating: faker.random.number({ min: 1, max: 5, precision: 0.5 }),
  }));

  const fakeDirectors = Array(...Array(10)).map(() => ({
    name: faker.name.findName(),
    birthday: faker.date.past(),
    country: faker.random.word()
  }));

  const fakeActors = Array(...Array(10)).map(() => ({
    name: faker.name.findName(),
    birthday: faker.date.past(),
    country: faker.random.word()
  }));

  await knex('movies').insert(fakeMovies);
  await knex('directors').insert(fakeDirectors);
  await knex('actors').insert(fakeActors);

  const movies = await knex('movies');
  const actors = await knex('actors');
  const directors = await knex('directors');

  const proms = movies.map(async (movie) => {
    await knex('movie_actor').insert([{
      movie_id: movie.id,
      actor_id: actors[faker.random.number({ min: 0, max: 9 })].id
    }]);

    await knex('actor_director').insert([{
      actor_id: actors[faker.random.number({ min: 0, max: 9 })].id,
      director_id: directors[faker.random.number({ min: 0, max: 9 })].id
    }]);
  });

  await Promise.all(proms);
};

require('dotenv').config();

const faker = require('faker');
const { assert } = require('chai');
const knexMock = require('mock-knex');
const { knex } = require('../../helpers');
const Actor = require('../../loaders/actor');
const fakes = require('../data/fakes');

const knexTracker = knexMock.getTracker();

describe('Actor loader test', () => {
  beforeEach(() => {
    knexMock.mock(knex);
    knexTracker.install();
  });

  afterEach(() => {
    knexMock.unmock(knex);
    knexTracker.uninstall();
  });

  describe('- actorsByMovieIDs test', () => {
    it('- builds proper query', async () => {
      knexTracker.on('query', (query, step) => {
        [
          () => {
            assert.equal(query.sql, 'select `actors`.*, `movie_id` from `actors` inner join `movie_actor` on `movie_actor`.`actor_id` = `actors`.`id` where `movie_actor`.`movie_id` in (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 'Incorrect query');
            query.response([]);
          }
        ][step - 1]();
      });

      await Actor.actorsByMovieIDs(fakes.ids);
    });

    it('- sends proper ids into the query', async () => {
      knexTracker.on('query', (query, step) => {
        [
          () => {
            assert.deepEqual(query.bindings, fakes.ids, 'Incorrect ids passed');
            query.response([]);
          }
        ][step - 1]();
      });

      await Actor.actorsByMovieIDs(fakes.ids);
    });

    it('- returns actors properly', async () => {
      const fakeActors = fakes.ids.map(id => ({
        movie_id: id,
        name: faker.random.word()
      }));

      knexTracker.on('query', (query, step) => {
        [
          () => {
            query.response(fakeActors);
          }
        ][step - 1]();
      });

      const actors = await Actor.actorsByMovieIDs(fakes.ids);

      assert.deepEqual(actors, fakeActors.map(actor => ([actor])));
    });
  });
});

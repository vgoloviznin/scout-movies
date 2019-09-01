require('dotenv').config();

const faker = require('faker');
const { assert } = require('chai');
const knexMock = require('mock-knex');
const { knex } = require('../../helpers');
const Director = require('../../loaders/director');
const fakes = require('../data/fakes');

const knexTracker = knexMock.getTracker();

describe('Director loader test', () => {
  beforeEach(() => {
    knexMock.mock(knex);
    knexTracker.install();
  });

  afterEach(() => {
    knexMock.unmock(knex);
    knexTracker.uninstall();
  });

  describe('- directorsByActorIDs test', () => {
    it('- builds proper query', async () => {
      knexTracker.on('query', (query, step) => {
        [
          () => {
            assert.equal(query.sql, 'select `directors`.*, `actor_id` from `directors` inner join `actor_director` on `actor_director`.`director_id` = `directors`.`id` where `actor_director`.`actor_id` in (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 'Incorrect query');
            query.response([]);
          }
        ][step - 1]();
      });

      await Director.directorsByActorIDs(fakes.ids);
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

      await Director.directorsByActorIDs(fakes.ids);
    });

    it('- returns actors properly', async () => {
      const fakeActors = fakes.ids.map(id => ({
        actor_id: id,
        name: faker.random.word()
      }));

      knexTracker.on('query', (query, step) => {
        [
          () => {
            query.response(fakeActors);
          }
        ][step - 1]();
      });

      const actors = await Director.directorsByActorIDs(fakes.ids);

      assert.deepEqual(actors, fakeActors.map(actor => ([actor])));
    });
  });
});

require('dotenv').config();

const { assert } = require('chai');
const knexMock = require('mock-knex');
const { knex } = require('../../helpers');
const Actor = require('../../resolvers/actor');
const fakes = require('../data/fakes');

const knexTracker = knexMock.getTracker();

describe('Actor resolver test', () => {
  beforeEach(() => {
    knexMock.mock(knex);
    knexTracker.install();
  });

  afterEach(() => {
    knexMock.unmock(knex);
    knexTracker.uninstall();
  });

  describe('- directors test', () => {
    it('- builds proper query', async () => {
      knexTracker.on('query', (query, step) => {
        [
          () => {
            assert.equal(query.sql, 'select `directors`.* from `directors` inner join `actor_director` on `actor_director`.`director_id` = `directors`.`id` where `actor_director`.`actor_id` = ?', 'Incorrect query');
            query.response([]);
          }
        ][step - 1]();
      });

      await Actor.Actor.directors(fakes.actor);
    });

    it('- sends proper id into the query', async () => {
      knexTracker.on('query', (query, step) => {
        [
          () => {
            assert.deepEqual(query.bindings, [fakes.actor.id], 'Incorrect id passed');
            query.response([]);
          }
        ][step - 1]();
      });

      await Actor.Actor.directors(fakes.actor);
    });

    it('- returns directors properly', async () => {
      knexTracker.on('query', (query, step) => {
        [
          () => {
            query.response(fakes.directors);
          }
        ][step - 1]();
      });

      const directors = await Actor.Actor.directors(fakes.actor);

      assert.deepEqual(directors, fakes.directors);
    });
  });
});

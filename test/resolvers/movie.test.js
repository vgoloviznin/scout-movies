require('dotenv').config();

const sinon = require('sinon');
const { assert } = require('chai');
const knexMock = require('mock-knex');
const { knex } = require('../../helpers');
const Resolver = require('../../resolvers/movie');
const fakes = require('../data/fakes');
const loaders = require('../../loaders');

const knexTracker = knexMock.getTracker();

describe('Movie resolver test', () => {
  beforeEach(() => {
    knexMock.mock(knex);
    knexTracker.install();
  });

  afterEach(() => {
    knexMock.unmock(knex);
    knexTracker.uninstall();
    sinon.restore();
  });

  describe('- Queries tests', () => {
    describe('- movies test', () => {
      it('- builds proper query', async () => {
        knexTracker.on('query', (query, step) => {
          [
            () => {
              assert.equal(query.sql, 'select * from `movies`', 'Incorrect query');
              query.response([]);
            }
          ][step - 1]();
        });

        await Resolver.Query.movies();
      });

      it('- returns movies properly', async () => {
        knexTracker.on('query', (query, step) => {
          [
            () => {
              query.response(fakes.movies);
            }
          ][step - 1]();
        });

        const movies = await Resolver.Query.movies();

        assert.deepEqual(movies, fakes.movies);
      });
    });
  });

  describe('- Movie tests', () => {
    describe('- actors test', () => {
      it('- calls loader properly', async () => {
        const stub = sinon.stub(loaders.Actor.actorsByMovieIDs, 'load');
        stub.returns(true);

        await Resolver.Movie.actors(fakes.movie, null, { loaders });

        sinon.assert.calledOnce(stub);
        sinon.assert.calledWithExactly(stub, fakes.movie.id);
      });
    });

    describe('- scoutbase_rating', () => {
      it('- returns a string if loggedIn', () => {
        const rating = Resolver.Movie.scoutbase_rating(false, false, { isLoggedIn: true });

        assert.isString(rating);
      });

      it('- returns undefined if not logged in', () => {
        const rating = Resolver.Movie.scoutbase_rating(false, false, { isLoggedIn: false });

        assert.isUndefined(rating);
      });
    });
  });
});

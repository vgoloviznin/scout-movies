require('dotenv').config();

const { assert } = require('chai');
const knexMock = require('mock-knex');
const { knex } = require('../../helpers');
const Movie = require('../../resolvers/movie');
const fakes = require('../data/fakes');

const knexTracker = knexMock.getTracker();

describe('Movie resolver test', () => {
  beforeEach(() => {
    knexMock.mock(knex);
    knexTracker.install();
  });

  afterEach(() => {
    knexMock.unmock(knex);
    knexTracker.uninstall();
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

        await Movie.Query.movies();
      });

      it('- returns movies properly', async () => {
        knexTracker.on('query', (query, step) => {
          [
            () => {
              query.response(fakes.movies);
            }
          ][step - 1]();
        });

        const movies = await Movie.Query.movies();

        assert.deepEqual(movies, fakes.movies);
      });
    });
  });

  describe('- Movie tests', () => {
    describe('- actors test', () => {
      it('- builds proper query', async () => {
        knexTracker.on('query', (query, step) => {
          [
            () => {
              assert.equal(query.sql, 'select `actors`.* from `actors` inner join `movie_actor` on `movie_actor`.`actor_id` = `actors`.`id` where `movie_actor`.`movie_id` = ?', 'Incorrect query');
              query.response([]);
            }
          ][step - 1]();
        });

        await Movie.Movie.actors(fakes.movie);
      });

      it('- sends proper id into the query', async () => {
        knexTracker.on('query', (query, step) => {
          [
            () => {
              assert.deepEqual(query.bindings, [fakes.movie.id], 'Incorrect id passed');
              query.response([]);
            }
          ][step - 1]();
        });

        await Movie.Movie.actors(fakes.movie);
      });

      it('- returns directors properly', async () => {
        knexTracker.on('query', (query, step) => {
          [
            () => {
              query.response(fakes.actors);
            }
          ][step - 1]();
        });

        const actors = await Movie.Movie.actors(fakes.movie);

        assert.deepEqual(actors, fakes.actors);
      });
    });

    describe('- scoutbase_rating', () => {
      it('- returns a string if loggedIn', () => {
        const rating = Movie.Movie.scoutbase_rating(false, false, { isLoggedIn: true });

        assert.isString(rating);
      });

      it('- returns undefined if not logged in', () => {
        const rating = Movie.Movie.scoutbase_rating(false, false, { isLoggedIn: false });

        assert.isUndefined(rating);
      });
    });
  });
});

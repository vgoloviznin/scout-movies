require('dotenv').config();

const sinon = require('sinon');
const { assert } = require('chai');
const knexMock = require('mock-knex');
const bcrypt = require('bcryptjs');
const { knex } = require('../../helpers');
const User = require('../../resolvers/user');
const fakes = require('../data/fakes');

const knexTracker = knexMock.getTracker();

describe('User resolver test', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    knexMock.mock(knex);
    knexTracker.install();
  });

  afterEach(() => {
    sandbox.restore();
    knexMock.unmock(knex);
    knexTracker.uninstall();
  });

  describe('- createUser test', () => {
    it('- builds proper queery to check for existing user', async () => {
      knexTracker.on('query', (query, step) => {
        [
          () => {
            assert.equal(query.sql, 'select * from `users` where `username` = ?', 'Incorrect query');
            query.response([fakes.user]);
          }
        ][step - 1]();
      });

      try {
        await User.Mutation.createUser(null, fakes.user);
      } catch (e) {
        assert.equal(e.message, 'User already exists');
      }
    });

    it('- passes username properly', async () => {
      knexTracker.on('query', (query, step) => {
        [
          () => {
            assert.deepEqual(query.bindings, [fakes.user.username], 'Incorrect useername passed');
            query.response([fakes.user]);
          }
        ][step - 1]();
      });

      try {
        await User.Mutation.createUser(null, fakes.user);
      } catch (e) {
        assert.equal(e.message, 'User already exists');
      }
    });

    it('- inserts user with proper values', async () => {
      knexTracker.on('query', (query, step) => {
        [
          () => {
            query.response([]);
          },
          () => {
            console.log(query.sql);
            assert.deepEqual(query.bindings, [fakes.user.username], 'Incorrect useername passed');
          }
        ][step - 1]();
      });

      const compareStub = sandbox.stub(bcrypt, 'hash');

      try {
        await User.Mutation.createUser(null, fakes.user);
      } catch (e) {
        assert.equal(e.message, 'User already exists');
      }
    });
  });
});

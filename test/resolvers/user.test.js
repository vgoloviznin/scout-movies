require('dotenv').config();

const sinon = require('sinon');
const { assert } = require('chai');
const knexMock = require('mock-knex');
const bcrypt = require('bcryptjs');
const { knex, auth } = require('../../helpers');
const User = require('../../resolvers/user');
const fakes = require('../data/fakes');

const knexTracker = knexMock.getTracker();

describe('User resolver test', () => {
  beforeEach(() => {
    knexMock.mock(knex);
    knexTracker.install();
  });

  afterEach(() => {
    sinon.restore();
    knexMock.unmock(knex);
    knexTracker.uninstall();
  });

  describe('- createUser test', () => {
    it('- builds proper query to check for existing user', async () => {
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
        assert.deepEqual(e.invalidArgs, ['username']);
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
          function getExistingUser() {
            query.response([]);
          },
          function createUser() {
            assert.equal(query.sql, 'insert into `users` (`password`, `username`) values (?, ?)', 'Incorrect username password passed');
            assert.deepEqual(query.bindings, [fakes.password, fakes.user.username], 'Incorrect useername passed');
            query.response([fakes.user.id]);
          }
        ][step - 1]();
      });

      const compareStub = sinon.stub(bcrypt, 'hash');
      compareStub.returns(Promise.resolve(fakes.password));

      const authStub = sinon.stub(auth, 'generateToken');
      authStub.returns(fakes.token);

      await User.Mutation.createUser(null, fakes.user);
    });

    it('- returns proper user after success', async () => {
      knexTracker.on('query', (query, step) => {
        [
          function getExistingUser() {
            query.response([]);
          },
          function createUser() {
            query.response([fakes.user.id]);
          }
        ][step - 1]();
      });

      const compareStub = sinon.stub(bcrypt, 'hash');
      compareStub.returns(Promise.resolve(fakes.password));

      const authStub = sinon.stub(auth, 'generateToken');
      authStub.returns(fakes.token);

      const testUser = { token: fakes.token, user: { name: fakes.user.username, id: fakes.user.id } };

      const user = await User.Mutation.createUser(null, fakes.user);

      assert.deepEqual(user, testUser);
    });
  });

  describe('- login test', () => {
    it('- builds proper query to check for existing user', async () => {
      knexTracker.on('query', (query, step) => {
        [
          () => {
            assert.equal(query.sql, 'select * from `users` where `username` = ?', 'Incorrect query');
            query.response([fakes.user]);
          }
        ][step - 1]();
      });

      try {
        await User.Mutation.login(null, fakes.user);
      } catch (e) {
        assert.deepEqual(e.invalidArgs, ['username', 'password']);
        assert.equal(e.message, 'User not found');
      }
    });

    it('- returns proper error if password not correcct', async () => {
      knexTracker.on('query', (query, step) => {
        [
          function getExistingUser() {
            query.response([fakes.user]);
          }
        ][step - 1]();
      });

      const compareStub = sinon.stub(bcrypt, 'compare');
      compareStub.returns(Promise.resolve(false));

      try {
        await User.Mutation.login(null, fakes.user);
      } catch (e) {
        assert.deepEqual(e.invalidArgs, ['username', 'password']);
        assert.equal(e.message, 'User not found');
      }
    });

    it('- returns proper user upon successful login', async () => {
      knexTracker.on('query', (query, step) => {
        [
          function getExistingUser() {
            query.response([fakes.user]);
          }
        ][step - 1]();
      });

      const compareStub = sinon.stub(bcrypt, 'compare');
      compareStub.returns(Promise.resolve(true));

      const authStub = sinon.stub(auth, 'generateToken');
      authStub.returns(fakes.token);

      const testUser = { token: fakes.token, user: { name: fakes.user.username, id: fakes.user.id } };

      const user = await User.Mutation.login(null, fakes.user);

      assert.deepEqual(user, testUser);
    });
  });
});

const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server-koa');
const { knex, auth } = require('../helpers');

const PASSWORD_SALT_ROUNDS = 13;

function loginUser(id, name, hash) {
  return {
    token: auth.generateToken(id, name, hash),
    user: {
      id,
      name
    }
  };
}

module.exports = {
  Mutation: {
    createUser: async (_, { username, password }) => {
      const [existingUser] = await knex('users').where('username', username);

      if (existingUser) {
        throw new UserInputError('User already exists', {
          invalidArgs: ['username'],
        });
      }

      const hash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

      const [id] = await knex('users').insert({ username, password: hash });

      return loginUser(id, username, hash);
    },
    login: async (_, { username, password }) => {
      const [existingUser] = await knex('users').where('username', username);

      if (!existingUser) {
        throw new UserInputError('User not found', {
          invalidArgs: ['username', 'password'],
        });
      }

      const result = await bcrypt.compare(password, existingUser.password);

      if (!result) {
        throw new UserInputError('User not found', {
          invalidArgs: ['username', 'password'],
        });
      }

      return loginUser(existingUser.id, existingUser.username, existingUser.password);
    },
  }
};

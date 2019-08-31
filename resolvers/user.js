const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server-koa');
const { knex, auth } = require('../helpers');

function loginUser(id, name) {
  return {
    token: auth.generateToken(name),
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

      const hash = await bcrypt.hash(password, process.env.PASSWORD_SALT_ROUNDS);

      const [id] = await knex('users').insert({ username, password: hash });

      return loginUser(id, username);
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

      return loginUser(existingUser.id, existingUser.username);
    },
  }
};

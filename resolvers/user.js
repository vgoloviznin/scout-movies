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
        throw new UserInputError('Form Arguments invalid', {
          invalidArgs: ['username'],
        });
      }

      const hash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

      const [id] = await knex('users').insert({ username, password: hash });

      return loginUser(id, username, hash);
    }
  }
};

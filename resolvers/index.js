const { mergeResolvers } = require('merge-graphql-schemas');
const Movie = require('./movie');
const Actor = require('./actor');
const User = require('./user');

module.exports = mergeResolvers([Movie, Actor, User]);

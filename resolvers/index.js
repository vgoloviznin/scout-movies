const { mergeResolvers } = require('merge-graphql-schemas');
const Movie = require('./movie');
const Actor = require('./actor');

module.exports = mergeResolvers([Movie, Actor]);

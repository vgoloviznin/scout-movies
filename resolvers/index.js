const { mergeResolvers } = require('merge-graphql-schemas');
const Movie = require('./movie');

module.exports = mergeResolvers([Movie]);

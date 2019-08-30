const { mergeTypes } = require('merge-graphql-schemas');

const User = require('./user');
const Movie = require('./movie');
const Director = require('./director');
const Actor = require('./actor');

module.exports = mergeTypes([User, Movie, Director, Actor]);

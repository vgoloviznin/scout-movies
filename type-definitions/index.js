const { gql } = require('apollo-server-koa');

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

module.exports = typeDefs;

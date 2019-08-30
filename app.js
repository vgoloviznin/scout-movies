const Koa = require('koa');
const { ApolloServer } = require('apollo-server-koa');
const typeDefs = require('./models');
const resolvers = require('./resolvers');

const app = new Koa();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}, gql: ${server.graphqlPath}`);
});

module.exports = app;

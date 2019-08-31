require('dotenv').config();

const Koa = require('koa');
const { ApolloServer } = require('apollo-server-koa');
const typeDefs = require('./models');
const resolvers = require('./resolvers');
const { auth } = require('./helpers');

const app = new Koa();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ ctx }) => auth.contextHelper(ctx)
});

server.applyMiddleware({ app });

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}, gql: ${server.graphqlPath}`);
});

module.exports = app;

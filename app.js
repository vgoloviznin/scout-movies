require('dotenv').config();

const Koa = require('koa');
const { ApolloServer, AuthenticationError, UserInputError } = require('apollo-server-koa');
const typeDefs = require('./models');
const resolvers = require('./resolvers');
const loaders = require('./loaders');
const { auth } = require('./helpers');

const app = new Koa();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  loaders,
  context: async ({ ctx }) => auth.contextHelper(ctx),
  rewriteError(err) {
    if (err instanceof AuthenticationError || err instanceof UserInputError) {
      return null;
    }

    return err;
  }
});

server.applyMiddleware({ app });

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}, gql: ${server.graphqlPath}`);
});

module.exports = app;

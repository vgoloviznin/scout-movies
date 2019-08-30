module.exports = `
  type User {
    id: ID!
    name: String!
  }

  type AuthenticatedUser {
    token: String!
    user: User!
  }

  type Mutation {
    createUser(username: String!, password: String!): AuthenticatedUser!
    login(username: String!, password: String!): AuthenticatedUser!
  }
`;

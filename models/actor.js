module.exports = `
  type Actor {
    name: String!
    birthday: String!
    country: String
    directors: [Director!]
  }
`;

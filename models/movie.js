module.exports = `
  type Movie {
    title: String!
    year: Int
    rating: Float
    actors: [Actor!]
  }

  type Query {
    movies: [Movie!]
  }
`;

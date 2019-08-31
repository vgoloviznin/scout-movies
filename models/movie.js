module.exports = `
  type Movie {
    title: String!
    year: Int
    rating: Float
    actors: [Actor!]
    scoutbase_rating: String
  }

  type Query {
    movies: [Movie!]
  }
`;

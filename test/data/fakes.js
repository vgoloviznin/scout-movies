const faker = require('faker');

module.exports = {
  ids: Array(...Array(10)).map(() => faker.random.number()),
  token: faker.random.word(),
  password: faker.internet.password(),
  user: {
    username: faker.random.word(),
    password: faker.random.word(),
    id: faker.random.number()
  },
  actor: {
    name: faker.name.findName(),
    birthday: faker.date.past(),
    country: faker.random.word(),
    id: faker.random.number()
  },
  movie: {
    title: faker.random.words(),
    year: faker.random.number({ min: 1900, max: 2019 }),
    rating: faker.random.number({ min: 1, max: 5, precision: 0.5 }),
    id: faker.random.number()
  },
  directors: Array(...Array(10)).map(() => ({
    name: faker.name.findName(),
    birthday: faker.date.past(),
    country: faker.random.word()
  })),
  movies: Array(...Array(10)).map(() => ({
    title: faker.random.words(),
    year: faker.random.number({ min: 1900, max: 2019 }),
    rating: faker.random.number({ min: 1, max: 5, precision: 0.5 }),
  })),
  actors: Array(...Array(10)).map(() => ({
    name: faker.name.findName(),
    birthday: faker.date.past(),
    country: faker.random.word()
  }))
};

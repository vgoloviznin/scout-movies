require('dotenv').config();

const sinon = require('sinon');
const Resolver = require('../../resolvers/actor');
const fakes = require('../data/fakes');
const loaders = require('../../loaders');


describe('Actor resolver test', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('- directors test', () => {
    it('- calls loader properly', async () => {
      const stub = sinon.stub(loaders.Director.directorsByActorIDs, 'load');
      stub.returns(true);

      await Resolver.Actor.directors(fakes.actor, null, { loaders });

      sinon.assert.calledOnce(stub);
      sinon.assert.calledWithExactly(stub, fakes.actor.id);
    });
  });
});

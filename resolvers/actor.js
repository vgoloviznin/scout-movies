
module.exports = {
  Actor: {
    directors: (actor, _, { loaders }) => loaders.Director.directorsByActorIDs.load(actor.id)
  }
};


module.exports = {
  Actor: {
    directors: (actor, _, { loaders }) => loaders.directorsByActorIDs.load(actor.id)
  }
};

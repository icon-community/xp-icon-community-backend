async function createEntry(param, collectionId, connection) {
  const model = connection.model(collectionId);
  const entry = new model(param);
  return await entry.save();
}

async function getAllEntries(collectionId, connection) {
  const model = connection.model(collectionId);
  return await model.find();
}

module.exports = {
  createEntry,
  getAllEntries,
};

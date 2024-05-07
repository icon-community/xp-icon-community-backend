async function createEntry(param, collectionId, connection) {
  const model = connection.model(collectionId);
  const entry = new model(param);
  return await entry.save();
}

async function getAllEntries(collectionId, connection) {
  const model = connection.model(collectionId);
  return await model.find();
}

async function getEntryById(id, collectionId, connection) {
  const model = connection.model(collectionId);
  return await model.findById(id);
}

async function getEntryByParam(param, colletionId, connection) {
  const model = connection.model(colletionId);
  return await model.find(param);
}

async function updateOrCreateEntry(query, update, collectionId, connection) {
  try {
    const model = connection.model(collectionId);
    const result = await model.findOneAndUpdate(query, update, {
      new: true,
      upsert: true,
    });

    return result;
  } catch (err) {
    console.log("Error updating or creating entry:");
    console.log(err);
    throw new Error(err);
  }
}

module.exports = {
  createEntry,
  getAllEntries,
  getEntryById,
  getEntryByParam,
  updateOrCreateEntry,
};

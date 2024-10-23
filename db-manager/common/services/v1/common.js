async function createEntry(param, collectionId, connection = null) {
  try {
    if (connection == null) {
      throw new Error("Connection not provided");
    }

    const model = connection.model(collectionId);
    const entry = new model(param);
    return await entry.save();
  } catch (err) {
    console.log("Error creating entry:");
    console.log(err);
    throw new Error(err.message);
  }
}

async function getAllEntries(collectionId, connection = null) {
  try {
    if (connection == null) {
      throw new Error("Connection not provided");
    }

    const model = connection.model(collectionId);
    return await model.find();
  } catch (err) {
    console.log("Error on getAllEntries:");
    console.log(err);
    throw new Error(err.message);
  }
}

async function getEntryById(id, collectionId, connection = null) {
  try {
    if (connection == null) {
      throw new Error("Connection not provided");
    }

    const model = connection.model(collectionId);
    return await model.findById(id);
  } catch (err) {
    console.log("Error on getEntryById:");
    console.log(err);
    throw new Error(err.message);
  }
}

async function getEntryByParam(param, colletionId, connection = null) {
  try {
    if (connection == null) {
      throw new Error("Connection not provided");
    }

    const model = connection.model(colletionId);
    return await model.find(param);
  } catch (err) {
    console.log("Error on getEntryByParam:");
    console.log(err);
    throw new Error(err.message);
  }
}

async function updateOrCreateEntry(
  query,
  update,
  collectionId,
  connection = null,
  upsert = true,
) {
  try {
    if (connection == null) {
      throw new Error("Connection not provided");
    }
    const model = connection.model(collectionId);
    const result = await model.findOneAndUpdate(query, update, {
      new: true,
      upsert: upsert,
    });

    return result;
  } catch (err) {
    console.log("Error updating or creating entry:");
    console.log(err);
    throw new Error(err.message);
  }
}

async function getDocumentCount(filter, collectionId, connection = null) {
  try {
    if (connection == null) {
      throw new Error("Connection not provided");
    }

    const model = connection.model(collectionId);
    return await model.where(filter).countDocuments();
  } catch (err) {
    console.log("Error on getDocumentCount:");
    console.log(err);
    throw new Error(err.message);
  }
}

module.exports = {
  createEntry,
  getAllEntries,
  getEntryById,
  getEntryByParam,
  updateOrCreateEntry,
  getDocumentCount,
};

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.DATABASE_URL);
exports.getCollection = async (collection) => {
  await client.connect();
  const db = client.db();
  return db.collection(collection);
};

const { MongoClient } = require('mongodb');
const path = require('path');

require('dotenv').config(path.join(__dirname, '.env'));

const client = new MongoClient(process.env.DATABASE_URL);

async function connectToDb() {
    let connection = null;
    console.log('Conectando...');
    try {
        connection = await client.connect();
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.log(error.message);
    }
    return connection;
}

async function disconnectFromDb() {
    try {
        await client.close();
        console.log('Desconectado de MongoDB');
    } catch (error) {
        console.log(error.message);
    }
}

async function connectToCollection(collectionName) {
    const connection = await connectToDb();
    const db = connection.db(process.env.DATABASE_NAME);
    const collection = db.collection(collectionName);

    return collection;
}

async function generateCode(collectionName) {
    const collection = await connectToCollection(collectionName);
    const documentMaxCode = await collection.find().sort({ codigo: -1 }).limit(1).toArray();
    const maxCode = documentMaxCode[0]?.codigo ?? 0;

    return maxCode + 1;
}

module.exports = { connectToDb, disconnectFromDb, connectToCollection, generateCode };

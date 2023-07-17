const { MongoClient } = require('mongodb');
const urls = [
    'mongodb://localhost:27017/db1',
    'mongodb://localhost:27017/db2',
    'mongodb://localhost:27017/db3'
];
const clients = [];

const connectToDatabases = async () => {
    try {
        for (const url of urls) {
            const client = new MongoClient(url);
            await client.connect();
            clients.push(client);
            console.log(`Connected to database: ${url}`);
        }
        return clients;
        // Perform operations with each database connection
        // Example: clients[0].db('db1').collection('collection1').find({}).toArray().then(...);
    } catch (error) {
        console.error('Error connecting to databases:', error.message);
        throw error;
    }
};

module.exports = {
    clients,
    connectToDatabases
};
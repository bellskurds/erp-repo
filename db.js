
const mongoose = require('mongoose');

// Object to store connections
const connections = {};

// Function to connect to MongoDB
const connectDB = async (dbname) => {
    // const currentConnection = mongoose.connection;

    // currentConnection.close();

    try {
        const connection = await mongoose.createConnection(`mongodb://localhost:27017/${dbname}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected to MongoDB for ${dbname}`);
        connections[dbname] = connection; // Store the connection in the connections object

        const glob = require('glob');
        const path = require('path');

        glob.sync('./models/**/*.js').forEach(function (file) {
            const model = require(path.resolve(file));
            // const schema = new mongoose.Schema(model.schema);

            connection.model(model.modelName, model.schema)
            console.log(model.modelName, 'model.modelName')
        });

        return connection
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
};

// Function to get a specific connection
const getConnection = async (dbname) => {
    console.log(dbname, '============')
    if (connections[dbname]) {
        return connections[dbname];
    } else {
        return await connectDB(dbname)
    }
};
// const mainConnection = mongoose.createConnection('mongodb://localhost:27017/erp-pro', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
module.exports = {
    connectDB,
    getConnection,
};

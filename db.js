const mongoose = require('mongoose');

exports.createConnection = (db) => {
    return mongoose.createConnection(`mongodb://localhost/${db}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
}
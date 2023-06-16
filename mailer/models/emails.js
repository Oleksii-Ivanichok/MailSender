const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    surname: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    }
});

const Email = mongoose.model('Email', postSchema);

module.exports = Email;

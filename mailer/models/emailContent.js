const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    subject: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    }
});

const Content = mongoose.model('Content', postSchema);

module.exports = Content;

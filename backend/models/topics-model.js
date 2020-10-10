const mongoose = require('mongoose');
const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    links: Array
})
const Topic = mongoose.model("Topic", topicSchema)
exports.Topic = Topic
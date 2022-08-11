
var mongoose = require("mongoose");
const { Schema } = mongoose;

const LanguageSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true,
    },
    program: {
        type: [String],
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Language", LanguageSchema, "Language");
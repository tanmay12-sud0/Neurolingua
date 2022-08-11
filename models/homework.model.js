
var mongoose = require("mongoose");
const { Schema } = mongoose;

const HomeworkSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    fileLink:
    {
        type: String,
        required: true
    },

    created_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Homework", HomeworkSchema, "Homework");
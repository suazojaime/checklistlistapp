const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title of the product"],
        minLength: [2, "Product Name must have at least 2 characterss"],
        unique: true 
    },
    body: {
        type: String,
        required: [true, "A title is not enough"],
        minLength: [3, "If is not so much to ask, more than 2 letters please"],
        maxLength: [255, "too much you crazy, the max its 255 characters"]
    },
}, {
    timestamps: true
});

NoteSchema.plugin(uniqueValidator)

const NoteModel = mongoose.model("Products", NoteSchema);

module.exports = NoteModel;


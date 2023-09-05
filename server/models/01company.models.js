const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const ClientSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, "Company name, or customer"],
        minLength: [3, "Comany name must have at least 3 characters"],
        unique: true 
    },
    sites:{
        type:{type: mongoose.Schema.Types.ObjectId, ref:"Sites"}
    }
}, {
    timestamps: true
});

ClientSchema.plugin(uniqueValidator)

const ClientModel = mongoose.model("Clients", ClientSchema);

module.exports = ClientModel;


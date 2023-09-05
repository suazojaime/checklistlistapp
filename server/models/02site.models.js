const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const SiteSchema = new mongoose.Schema({
    siteName: {
        type: String,
        required: [true, "Name of Site"],
        minLength: [2, "Name of Site must have at least 2 characterss"],
        unique: true 
    },
    acronym: {
        type: String,
        required: [true, "three letter code"],
        minLength: [3, "Product Name must have at least 2 characterss"],
        maxLength: [3, "too much you crazy, the max its 255 characters"],
        unique: true 
    },
    country: {
        type: String,
        required: [true, "Country is required"],
        minLength: [2, "Country name mustnhave a t least 2 characters"],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clients",
        required: true
    },
    summary: {
        type: String        
    },
    servers: {type:mongoose.Schema.Types.ObjectId, ref: 'Servers'}
}, {
    timestamps: true
});

SiteSchema.plugin(uniqueValidator)

const SiteModel = mongoose.model("Sites", SiteSchema);

module.exports = SiteModel;


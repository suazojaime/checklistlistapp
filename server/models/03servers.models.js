const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const ServerSchema = new mongoose.Schema({
    Application: {
        type: String,
        required: [true, "Application is required"],
        minLength: [2, "Min lenght of 2"],
        unique: false 
    },
    hostname: {
        type: String,
        required: [true, "required"],
        minLength: [3, "Min lenght of 2"],
        unique: false 
    },
    IP: {
        type: String,
        required: [true, "Country is required"],
        minLength: [7, "min leght 7"],
        maxLength: [15, "max length 15"],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sites",
        required: true
    },
    checklist: {type: mongoose.Schema.Types.ObjectId, ref:'ServersChecks'}
}, {
    timestamps: true
});

ServerSchema.plugin(uniqueValidator)

const ServerModel = mongoose.model("Servers", ServerSchema);

module.exports = ServerModel;


const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const ServerCheckListSchema = new mongoose.Schema({
    DriveSpace: {
        type: Boolean
    },
    DisableIPV6: {
        type: Boolean
    },
    BestPerformace: new mongoose.Schema({
        VisualEffects: {type: Boolean},
        BackgroundServices: {type: Boolean}
    }),
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Servers",
        required: true
    }
}, {
    timestamps: true
});

ServerCheckListSchema.plugin(uniqueValidator)

const ServerCheckListModel = mongoose.model("ServersChecks", ServerCheckListSchema);

module.exports = ServerCheckListModel;


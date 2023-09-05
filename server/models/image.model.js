const mongoose = require("mongoose");

const ImageScheme = new mongoose.Schema({
   Image: {
        data: Buffer, // Binary data for the image
        contentType: String, // MIME type of the image
      }
}, {
    timestamps: true
});


const ImageModel = mongoose.model("ImageScheme", ImageScheme);

module.exports = ImageModel;


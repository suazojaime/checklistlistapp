const ImageModel = require('../models/image.model')
const mongoose = require("mongoose");
const {ObjectId} = mongoose.Types;

const upload = require('../config/multer'); 

module.exports = {
    create : 
            
            async (req, res) => {
                try {
                // Create a new image document in MongoDB
                const newImage = new ImageModel({
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                });
            
                // Save the image document to the database
                await newImage.save();
            
                res.status(201).json({ message: 'Image uploaded successfully' });
                } catch (error) {
                console.error('Error uploading image:', error);
                res.status(500).json({ message: 'Internal Server Error' });
                }
            }
    
}
const ImageModel = require('../models/image.model')
const mongoose = require("mongoose");
const {ObjectId} = mongoose.Types;

const multer = require('multer'); 
const fs = require('fs');


// Configure Multer to store uploaded files
const storage = multer.memoryStorage(); // Store files in memory (you can configure a disk storage as well)
const upload = multer({ storage: storage });

console.log('gbhnjkml,')

module.exports = {
    upload : 
            (req, res) => {
                console.log(req.file)
                if (!req.file) {
                    console.log(req)
                return res.status(400).send('No file uploaded.');
                }
            
                // You can now access the uploaded file as req.file.buffer
                // You can save, process, or send it to cloud storage as needed
                // Example: Save to disk
                fs.writeFileSync('uploads/' + req.file.originalname, req.file.buffer);
            
                // Respond with a success message
                res.status(200).send('Image uploaded successfully.');
            }
}
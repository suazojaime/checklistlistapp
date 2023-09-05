const NoteModel = require('../models/note.models')
const mongoose = require("mongoose");
const {ObjectId} = mongoose.Types;

module.exports = {
    createNote : (req,res) => {
        console.log('creating!!!')
        NoteModel.create(req.body).then(()=>res.json({ok:'ok'}))
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError){
                let keys = Object.keys(error.errors);
                let error_dict = {};
                keys.map((key) => {
                    error_dict[key] = error.errors[key].message
                });
                res.status(500).json({error: error_dict})
            } else {
                res.status(500).json({error: error})
            }
        })
    },
    listAllNotes : (req,res) => {
        console.log('listing!!!')
        NoteModel.find().then((result)=>{
            res.json(result)
        })
    },
    listOneNote : (req,res) => {
        console.log('listing!!!')
        NoteModel.findById({_id:req.params.id}).then((result)=>{
            res.json(result)
        })
    },
    updateOneNote : (req,res) => {
        console.log(req.params)
        let id = req.params.id;
        let data = req.body;
        const updateOptions = {
            new: true, // Return the updated document
            runValidators: true, // Enforce validation during update
        };
        if (!ObjectId.isValid(id))
            return res.status(400).json({message: "id doesn't match the expected format"});
            NoteModel.findByIdAndUpdate({_id: id}, data, updateOptions)
            .then(() => {
                res.json({success: true})
            })
            .catch((error) => {
                if (error instanceof mongoose.Error.ValidationError){
                    let keys = Object.keys(error.errors);
                    let error_dict = {};
                    keys.map((key) => {
                        error_dict[key] = error.errors[key].message
                    });
                    res.status(500).json({error: error_dict})
                } else {
                    res.status(500).json({error: error})
                }
            })
    
    },
    deleteNote : (req, res) => {
        let id = req.params.id
        if (!ObjectId.isValid(id))
            return res.status(400).json({message: "id doesn't match the expected format"});
            NoteModel.deleteOne({_id: id})
            .then(() => {
                res.json({success: true})
            })
            .catch((error) => {
                res.status(500).json({error: error})
            })
    }
    
}
const SiteModel = require('../models/02site.models')
const mongoose = require("mongoose");
const {ObjectId} = mongoose.Types;

module.exports = {
    create : (req,res) => {
        console.log('creating!!!')
        SiteModel.create(req.body)
        .then((newElement) => SiteModel.findById({_id: newElement._id}).populate('owner'))
        .then(() => res.status(201).json({ok:"ok"}))
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
    listAll : (req,res) => {
        console.log('listing!!!')
        SiteModel.find().populate("owner").then((result)=>{
            res.json(result)
        })
    },
    listOne : (req,res) => {
        console.log('listing!!!')
        SiteModel.findById({_id:req.params.id})
        .populate("owner")
        .then((result)=>{
            res.json(result)
        })
    },
    updateOne : (req,res) => {
        console.log(req.params)
        let id = req.params.id;
        let data = req.body;
        const updateOptions = {
            new: true, // Return the updated document
            runValidators: true, // Enforce validation during update
        };
        if (!ObjectId.isValid(id))
            return res.status(400).json({message: "id doesn't match the expected format"});
            SiteModel.findByIdAndUpdate({_id: id}, data, updateOptions)
            .populate("owner")
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
    deleteOne : (req, res) => {
        let id = req.params.id
        if (!ObjectId.isValid(id))
            return res.status(400).json({message: "id doesn't match the expected format"});
            SiteModel.deleteOne({_id: id})
            .then(() => {
                res.json({success: true})
            })
            .catch((error) => {
                res.status(500).json({error: error})
            })
    }
    
}
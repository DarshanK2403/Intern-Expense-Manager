const Vendor = require("../models/Vendor");

const AddVendor = async (req, res) =>{    
    const {userId} = req.params;
    try {
        const {name, email, phone, category, notes} = req.body;
        if(!name){
            return res.status(400).json({param: name, message: "vendor name is required"});
        }
        const vendorExist = await Vendor.findOne({userId: userId, name : name})
        if({vendorExist}){
            return res.status(400).json({message: "Vendor alredy exist"})
        }
        const createVendor = await Vendor.create(
            name,
            email,
            phone,
            category,
            notes,
            userId
        );
        if(createVendor){
            res.status(200).json({message: "Success", Data: createVendor});
        }else{
            res.status(400).json({message: "request failed"});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    AddVendor
}
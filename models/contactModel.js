const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    email: {type: String, required:true},
    fullName: {type: String, required:true},
    areaText: {type: String, required:true},
});

const CONTACTMODEL = mongoose.model(
    'contact',
    schema
);

module.exports = CONTACTMODEL;
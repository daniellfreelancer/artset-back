const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    email: {type: String, required:true}
});

const EMAILMODEL = mongoose.model(
    'email',
    schema
);

module.exports = EMAILMODEL;
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    country:{
        type: String,
    },
    latitude:{
        type: Number,
    },
    longitude:{
        type: Number,
    },
    nickname:{
        type: String,
        maxlength:50,
    },
    isFavorite:{
        type: Boolean,
        default: false,
    },
},
{
    timestamps:true
});

const Location = mongoose.model('Location', locationSchema);

module.exports = {Location};
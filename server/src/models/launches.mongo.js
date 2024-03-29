const mongoose = require("mongoose")

const launchesSchema = new mongoose.Schema({
    flightNumber:{
        type: Number,
        required: true
    },
    mission:{
        type: String,
        required: true
    },
    target:{
        type: String,
    },
    launchDate:{
        type: Date,
        required: true
    },
    rocket:{
        type: String,
        required: true
    },
    upcoming:{
        type: Boolean,
        required: true
    },
    success:{
        type: Boolean,
        required: true,
        default: true
    },
    customers:{
        type: [String],
        required:true
    }
});

module.exports = mongoose.model("Launch",launchesSchema)
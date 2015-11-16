/**
 * Created by erick on 06.04.15.
 */
var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;

var Countries = new Schema({
    country: {
        type: String,
        required: true,
        unique: true
    },
    short_description: {
        type: String,
        length: 300,
        required: true
    },
    full_description: {
        type: String,
        required: true
    },
    flag: {
        type: String,
        required: true
    },
    emblem: {
        type: String,
        required: true
    },
    gps: {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        }
    },
    images: {
        type: Array,
        required: true,
        default: []
    }
});

module.exports = mongoose.model("Countries", Countries);
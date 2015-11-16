/**
 * Created by erick on 06.04.15.
 */
var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;

var Places = new Schema({
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
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
    main_image: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        required: false,
        default: []
    }
});

module.exports = mongoose.model("Places", Places);
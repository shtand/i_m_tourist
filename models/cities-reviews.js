/**
 * Created by erick on 06.04.15.
 */
var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;

var Cities_Reviews = new Schema({
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        max: 10,
        required: true
    },
    review: {
        type: String,
        length: 400
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Cities_Reviews", Cities_Reviews);
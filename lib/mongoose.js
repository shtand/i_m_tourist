/**
 * Created by erick on 07.04.15.
 */
var mongoose = require('mongoose');

mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME); // Підключення до БД

var db = mongoose.connection;

db.on('error', function (err) {                     //
    console.log('error' + err.message);             //
});                                                 //
db.once('open', function callback () {              // Перевірка на помилку і вдалого підключення
    console.log('DateBase is okay');                //
    console.log(mongoose.connection.readyState);    //
});                                                 //

module.exports = mongoose;
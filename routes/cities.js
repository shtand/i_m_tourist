/**
 * Created by erick on 06.04.15.
 *
 * CRUD methods on cities
 *
 */
var express = require('express');
var router = express.Router();
var cities_Model = require('models/cities');
var countries_Model = require('models/countries');

/* GET users listing. */
router.get('/', function(req, res, next) {
    return res.json({error: 'Nein, nein, nein'});
});

router.post('/', function(req, res) {
    var city = new cities_Model({
        country: req.body.country,
        city: req.body.city,
        short_description: req.body.short_description,
        full_description: req.body.full_description,
        gps: req.body.gps,
        main_image: req.body.main_image,
        images: req.body.images
    });
    return countries_Model.find({country: req.body.country},function (err, country){
        if (!err && country[0]) {
            return cities_Model.find({country: req.body.country, city: req.body.city}, function (err, answer){
                if(!err && !answer[0]){
                    city.save(function (err) {
                        if (!err) {
                            console.log("city created");
                            return res.send({ status: 'OK', city:city });
                        } else {
                            console.log(err);
                            if(err.name == 'ValidationError') {
                                res.statusCode = 400;
                                res.send({ error: 'ValidationError'});
                            } else {
                                res.statusCode = 500;
                                res.send({ error: 'Server error' });
                            }
                            console.log('Internal error(%d): %s',res.statusCode,err.message);
                        }
                    });
                }else{
                    res.send({ error: 'Sorry, but this city already had been added.'});
                }
            });
        } else {
            console.log("Unknown country");
            return res.send({ error: 'Unknown country'});
        }
    });
});

// Виводить детальну інформацію про вказане місто, вказаної країни
router.get('/:country&:city', function(req, res, next) {
    return cities_Model.find({country: req.params.country, city: req.params.city}, function (err, city){
        if (!err && city[0]) { // перевірка на пустоту, якщо не пусте то нехай виводить інформацію
            return res.send(city);
        } else {
            if(!city[0]){ // Якщо пусте то нехай виведе 404
                res.statusCode = 404;
                console.log('Internal error(%d)',res.statusCode);
                return res.send({'error' : res.statusCode});
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send('Internal error(%d): %s',res.statusCode,err.message);
            }
        }
    });
});

// Виводить всі міста вказаної країни
router.get('/:country', function(req, res) {
    return cities_Model.find({country: req.params.country},function (err, cities){
        if (!err && cities[0]) {  // Перевірка чи пустий масив
            var resJSON = [];
            for (var i = 0; i < cities.length; i++){
                resJSON[i] = {  id: cities[i]._id,
                    country: cities[i].country,
                    city: cities[i].city,
                    gps: cities[i].gps
                };
            }
            return res.send(resJSON);
        } else {
            if(!cities[0]){ // Якщо пустий то нехай виводить 404
                res.statusCode = 404;
                console.log('Internal error(%d)',res.statusCode);
                return res.send({'error' : res.statusCode});
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send('error(%d): %s',res.statusCode,err.message);
            }
        }
    });
});

router.put('/:_id', function (req, res){
    return cities_Model.findById(req.params._id, function (err, city) {
        if(!city) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        // Перебирає в циклі всі подані в запиті параметри і присвоює їх об’єкту
        for (prop in req.body) {
            city[prop] = req.body[prop];
        }

        // Запис до бази даних зміненого об’єкту або висвітлювання помилки
        return city.save(function (err) {
            if (!err) {
                console.log("city updated");
                return res.send({ status: 'OK', city:city });
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                console.log('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
});

router.delete('/:_id', function (req, res){
    return cities_Model.findById(req.params._id, function (err, city) {
        if(!city) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return city.remove(function (err) {
            if (!err) {
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });
});

module.exports = router;
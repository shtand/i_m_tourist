/**
 * Created by erick on 06.04.15.
 *
 * CRUD methods on places
 *
 */
var express = require('express');
var router = express.Router();
var places_Model = require('models/places');
var cities_Model = require('models/cities');


router.get('/', function(req, res, next) {
    return res.json({error: 'Nein, nein, nein'});
});

router.post('/', function(req, res) {
    var place = new places_Model({
        country: req.body.country,
        city: req.body.city,
        place: req.body.place,
        short_description: req.body.short_description,
        full_description: req.body.full_description,
        gps: req.body.gps,
        main_image: req.body.main_image,
        images: req.body.images
    });

    return cities_Model.find({country: req.body.country, city: req.body.city},function (err, found){
        if (!err && found[0]) {
            return places_Model.find({country: req.body.country, city: req.body.city, place: req.body.place}, function (err, answer){
                if(!err && !answer[0]){
                    place.save(function (err) {
                        if (!err) {
                            console.log("place created");
                            return res.send({ status: 'OK', place:place });
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
                    res.send({ error: 'Sorry, but this place in this city and country already had been added.'});
                }
            });

        } else {
            return res.send({ error: 'Unknown country or city or country and city'});
        }
    });
});

// Виводить детальну інформацію про вказане місце
router.get('/:country&:city&:place', function(req, res, next) {
    return places_Model.find({country: req.params.country, city: req.params.city, place: req.params.place}, function (err, place){
        if (!err && place[0]) {
            return res.send(place);
        } else {
            if(!place[0]){
                res.statusCode = 404;
                console.log('Internal error(%d)',res.statusCode);
                return res.send({ error: 'Not found' });
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send('Internal error(%d): %s',res.statusCode,err.message);
            }
        }
    });
});

// Виводить всі місця для вказаного міста, вказаної країни
router.get('/:country&:city', function(req, res, next) {
    return places_Model.find({country: req.params.country, city: req.params.city}, function (err, places){
        if (!err && places[0]) {
            return res.send(places);
        } else {
            if(!places[0]){
                res.statusCode = 404;
                console.log('Internal error(%d)',res.statusCode);
                return res.send({ error: 'Not found' });
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send('Internal error(%d): %s',res.statusCode,err.message);
            }
        }
    });
});

router.put('/:_id', function (req, res){
    return places_Model.findById(req.params._id, function (err, place) {
        if(!place) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        // Перебирає в циклі всі подані в запиті параметри і присвоює їх об’єкту
        for (prop in req.body) {
            place[prop] = req.body[prop];
        }

        // Запис до бази даних зміненого об’єкту або висвітлювання помилки
        return place.save(function (err) {
            if (!err) {
                console.log("place updated");
                return res.send({ status: 'OK', place:place });
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
    return places_Model.findById(req.params._id, function (err, place) {
        if(!place) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return place.remove(function (err) {
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

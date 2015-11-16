/**
 * Created by erick on 06.04.15.
 *
 * CRUD methods on reviews to places
 *
 */
var express = require('express');
var router = express.Router();
var places_reviews_Model = require('models/places-reviews');
var cities_Model = require('models/cities');

/* GET users listing. */
router.get('/', function(req, res, next) {
    return res.json({error: 'Nein, nein, nein'});
});

router.post('/', function(req, res) {
    var place_review = new places_reviews_Model({
        country: req.body.country,
        city: req.body.city,
        place: req.body.place,
        nickname: req.body.nickname,
        rating: req.body.rating,
        review: req.body.review,
        status: 'unconfirmed'
    });

    return cities_Model.find({country: req.body.country, city: req.body.city},function (err, place){
        if (!err && place[0]) {
            place_review.save(function (err) {
                if (!err) {
                    console.log("place review created");
                    return res.send({ status: 'OK', review:place_review });
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
        } else {
            console.log("Unknown country");
            return res.send({ error: 'Unknown country or city or country and city'});
        }
    });
});

router.get('/:country&:city&:place', function(req, res) {
    return places_reviews_Model.find({country: req.params.country, city: req.params.city, place: req.params.place, status: 'unconfirmed'},function (err, place_reviews){
        if (!err && place_reviews[0]) {
            return res.send(place_reviews);
        } else {
            if(!place_reviews[0]){
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

router.put('/:_id', function (req, res){
    return places_reviews_Model.findById(req.params._id, function (err, place_review) {
        if(!place_review) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        // Перебирає в циклі всі подані в запиті параметри і присвоює їх об’єкту
        for (prop in req.body) {
            place_review[prop] = req.body[prop];
        }

        // Запис до бази даних зміненого об’єкту або висвітлювання помилки
        return place_review.save(function (err) {
            if (!err) {
                console.log("city updated");
                return res.send({ status: 'OK', review: place_review });
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
    return places_reviews_Model.findById(req.params._id, function (err, place_review) {
        if(!place_review) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return place_review.remove(function (err) {
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
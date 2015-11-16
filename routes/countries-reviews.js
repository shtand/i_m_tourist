/**
 * Created by erick on 06.04.15.
 *
 * CRUD methods on reviews to countries
 *
 */
var express = require('express');
var router = express.Router();
var countries_reviews_Model = require('models/countries-reviews');
var countries_Model = require('models/countries');

/* GET users listing. */
router.get('/', function(req, res, next) {
    return res.json({error: 'Nein, nein, nein'});
});

router.post('/', function(req, res) {

    var country_reviews = new countries_reviews_Model({
        country: req.body.country,
        nickname: req.body.nickname,
        rating: req.body.rating,
        review: req.body.review,
        status: 'unconfirmed'
    });

    return countries_Model.find({country: req.body.country},function (err, country){
        if (!err && country[0]) {
            country_reviews.save(function (err) {
                if (!err) {
                    console.log("Country review created");
                    return res.send({ status: 'OK', review:country_reviews });
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
            return res.send({ error: 'Unknown country'});
        }
    });
});

router.get('/:country', function(req, res) {
    return countries_reviews_Model.find({country: req.params.country, status: 'confirmed'},function (err, country_reviews){
        if (!err && country_reviews[0]) {
            return res.send(country_reviews);
        } else {
            if (!country_reviews[0]) {
                res.statusCode = 404;
                console.log('Internal error(%d)', res.statusCode);
                return res.send({'error': res.statusCode});
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send('Internal error(%d): %s', res.statusCode, err.message);

            }
        }
    });
});

router.put('/:_id', function (req, res){
    return countries_reviews_Model.findById(req.params._id, function (err, country_review) {
        if(!country_review) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        // Перебирає в циклі всі подані в запиті параметри і присвоює їх об’єкту
        for (prop in req.body) {
            country_review[prop] = req.body[prop];
        }

        // Запис до бази даних зміненого об’єкту або висвітлювання помилки
        return country_review.save(function (err) {
            if (!err) {
                console.log("Country review updated");
                return res.send({ status: 'OK', review: country_review });
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
    return countries_reviews_Model.findById(req.params._id, function (err, country_review) {
        if(!country_review) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return country_review.remove(function (err) {
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
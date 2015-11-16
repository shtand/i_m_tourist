/**
 * Created by erick on 06.04.15.
 *
 * CRUD methods on countries
 *
 */
var express = require('express');
var router = express.Router();
var countries_Model = require('models/countries');

router.get('/', function(req, res, next) {
    return countries_Model.find(function (err, countries){
        if (!err) {
            var resJSON = [];
            for (var i = 0; i < countries.length; i++){
                resJSON[i] = {  id: countries[i]._id,
                                country: countries[i].country,
                                gps: countries[i].gps
                };
            }
            return res.send(resJSON);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

router.post('/', function(req, res) {
    var country = new countries_Model({
        country: req.body.country,
        short_description: req.body.short_description,
        full_description: req.body.full_description,
        flag: req.body.flag,
        emblem: req.body.emblem,
        gps: req.body.gps,
        images: req.body.images
    });
    // Перевірка чи в БД є даний запис
    return countries_Model.find({country: req.body.country},function (err, country_search){
        if (!err && !country_search[0]) {
            // Збереження
            country.save(function (err) {
                if (!err) {
                    console.log("Country created");
                    return res.send({ status: 'OK', country: country });
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
            console.log("Sorry, but this country already had been added.");
            return res.send({ error: 'Sorry, but this country already had been added.'});
        }
    });

});

router.get('/:country', function(req, res) {
    return countries_Model.find({country: req.params.country}, function (err, country){
        if(!country) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send(country);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }

    });
});

router.put('/:_id', function (req, res){
    return countries_Model.findById(req.params._id, function (err, country) {
        if(!country) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        // Перебирає в циклі всі подані в запиті параметри і присвоює їх об’єкту
        for (prop in req.body) {
            country[prop] = req.body[prop];
        }

        // Запис до бази даних зміненого об’єкту або висвітлювання помилки
        return country.save(function (err) {
            if (!err) {
                console.log("Country updated");
                return res.send({ status: 'OK', country: country });
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
    return countries_Model.findById(req.params._id, function (err, country) {
        if(!country) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return country.remove(function (err) {
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
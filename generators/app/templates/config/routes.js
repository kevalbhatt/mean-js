var async = require('async'),
    express = require('express'),
    path = require("path");


module.exports = function(app) {

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);
    // create our router
    var router = express.Router();
    app.use('/api', router);
    // middleware to use for all requests
    router.use(function(req, res, next) {
        // do logging
        console.log('Something is happening.');
        next();
    });

    // ----------------------------------------------------
    router.route('/getBannerList')
        .get(function(req, res) {
            bannerQuery.getBannerList(function(response) {
                res.json(response);
            });

        });
        



};

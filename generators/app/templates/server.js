'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Initializing system variables
var config = require('./config/config');

//Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js|coffee)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

var app = express();

//express settings
require('./config/express')(app);

//Bootstrap routes
require('./config/routes')(app);

//Start the app by listening on <port>
var port = config.port;
app.listen(port);
app.on('error',function(e){
   console.log("Error: " + hostNames[i] + "\n" + e.message); 
   console.log( e.stack );
});
console.log('Express app started on port ' + port);

//expose app
exports = module.exports = app;

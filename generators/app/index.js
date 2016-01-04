'use strict';
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var readFile = require("html-wiring")


module.exports = yeoman.generators.Base.extend({
    constructor: function() {
        yeoman.generators.Base.apply(this, arguments);



        this.option('skip-welcome-message', {
            desc: 'Skips the welcome message',
            type: Boolean
        });

        this.option('skip-install', {
            desc: 'Skips the installation of dependencies',
            type: Boolean
        });

        this.option('skip-install-message', {
            desc: 'Skips the message after the installation of dependencies',
            type: Boolean
        });
    },

    initializing: function() {
        this.pkg = require('../../package.json');
    },

    prompting: function() {
        var done = this.async();

        if (!this.options['skip-welcome-message']) {
            this.log(yosay('Out of the box I include Express,mongoose,Node.js,AngularJS,jQuery,HTML5 Boilerplate and Bootstrap.'));
        }

        var prompts = [{
                type: 'checkbox',
                name: 'mainframeworks',
                message: 'Would you like to use mongoose ?',
                choices: [{
                    name: 'mongoose',
                    value: 'includeMongooes',

                }]
            }, {
                type: 'list',
                name: 'bootstapSelect',
                message: 'Would you like Bootstrap or Sass - Bootstrap ?',
                choices: [{
                    name: 'Sass',
                    value: 'includeSass',

                }, {
                    name: 'Bootstrap',
                    value: 'includeBootstrap',

                }]
            }, {
                type: 'checkbox',
                name: 'lib',
                message: 'What more lib would you like ?',
                choices: [{
                    name: 'Moment',
                    value: 'includeMoment',
                    checked: true
                }, {
                    name: 'Underscore',
                    value: 'includeUnderscore',
                    checked: true
                }, {
                    name: 'Angular UI Bootstrap',
                    value: 'includeABootstrap',
                    checked: true
                }]
            }


        ];

        this.prompt(prompts, function(answers) {
            var mainframeworks = answers.mainframeworks;
            var lib = answers.lib;
            var bootstrap = answers.bootstapSelect;

            var hasMainframeworks = function(mainframework) {
                return mainframeworks.indexOf(mainframework) !== -1;
            };

            var hasLib = function(libs) {
                return lib.indexOf(libs) !== -1;
            };
            var hasBootstrap = function(boot) {
                return bootstrap.indexOf(boot) !== -1;
            };
            // manually deal with the response, get back and store the results.
            // we change a bit this way of doing to automatically do this in the self.prompt() method.

            this.includeMongooes = hasMainframeworks('includeMongooes');
            this.includeABootstrap = hasLib('includeABootstrap');
            this.includeUnderscore = hasLib('includeUnderscore');
            this.includeMoment = hasLib('includeMoment');
            this.includeJQuery = true //hasLib('includeJQuery');

            this.includeSass = hasBootstrap('includeSass');
            this.includeBootstrap = hasBootstrap('includeBootstrap');

            done();
        }.bind(this));
    },

    writing: {

        /*  packageJSON: function() {
              //this.template('_package.json', 'package.json');
              //this.copy('_package.json', 'package.json');
          },*/
        bower: function() {
            var bower = {
                name: this.appname,
                private: true,
                dependencies: {},
                exportsOverride: {}
            };


            var bs = 'bootstrap' + (this.includeSass ? '-sass' : '');
            bower.dependencies[bs] = 'latest';

            bower.dependencies.angular = 'latest';
            bower.dependencies['angular-resource'] = 'latest';
            bower.dependencies['angular-cookies'] = 'latest';
            bower.dependencies['angular-route'] = 'latest';
            bower.dependencies['angular-ui-router'] = 'latest';
            bower.dependencies['angular-mocks'] = 'latest';
            bower.dependencies['angular-cookies'] = 'latest';
            bower.dependencies['angular-sanitize'] = 'latest';

            if (this.includeABootstrap) {
                bower.dependencies['angular-bootstrap'] = 'latest';
            }
            if (this.includeUnderscore) {
                bower.dependencies['underscore'] = 'latest';
            }
            if (this.includeMoment) {
                bower.dependencies['moment'] = 'latest';
            }

            if (this.includeJQuery) {
                bower.dependencies.jquery = 'latest';
            }


            this.fs.copy(
                this.templatePath('bowerrc'),
                this.destinationPath('.bowerrc')
            );
            this.write('bower.json', JSON.stringify(bower, null, 2));
        },

        jshint: function() {
            this.fs.copy(
                this.templatePath('jshintrc'),
                this.destinationPath('.jshintrc')
            );
        },

        mainStylesheet: function() {},
        app: function() {
            //JS
            this.copy('angular/js/controllers/user/user_controller.js', 'public/js/controllers/user/user_controller.js');
            this.copy('angular/js/directives/global/global_directive.js', 'public/js/directives/global/global_directive.js');
            this.copy('angular/js/services/user/user_service.js', 'public/js/services/user/user_service.js');
            this.copy('angular/js/app.js', 'public/js/app.js');
            this.copy('angular/js/config.js', 'public/js/config.js');
            this.copy('angular/js/init.js', 'public/js/init.js');

            //css
            this.copy('angular/styles/style.css', 'public/styles/style.css');
            this.copy('angular/styles/style_mobile.css', 'public/styles/style_mobile.css');
            this.copy('angular/styles/animate.css', 'public/styles/animate.css');

            //view
            this.copy('angular/views/header.html', 'public/views/header.html');
            this.copy('angular/views/footer.html', 'public/views/footer.html');
            this.copy('angular/views/index.html', 'public/views/index.html');
            this.copy('angular/views/user/user.html', 'public/views/user/user.html');

            this.copy('angular/images/banner.png', 'public/images/banner.png');

            //
            this.copy('angular/humans.txt', 'public/humans.txt');
            this.copy('angular/robots.txt', 'public/robots.txt');

            //Controller
            this.copy('app/controllers/index.js', 'app/controllers/index.js');

            /* this.copy('app/views/includes/head.jade', 'app/views/includes/head.jade')
             this.copy('app/views/includes/foot.jade', 'app/views/includes/foot.jade');*/

            if (this.includeMongooes) {
                //Mongooes model
                this.copy('app/models/list.js', 'app/models/list.js');
                this.copy('config/query/query.js', 'app/query/query.js');
            } else {
                this.copy('app/models/list.js', 'app/models/list.js');
            }
            if (this.includeSass) {
                this.copy('app/styles/_customVariables.scss', 'app/styles/_customVariables.scss');
                this.copy('app/styles/app.scss', 'app/styles/app.scss');
            }

            //JADE
            this.copy('app/views/layouts/default.jade', 'app/views/layouts/default.jade');
            this.copy('app/views/404.jade', 'app/views/404.jade');
            this.copy('app/views/500.jade', 'app/views/500.jade');
            this.copy('app/views/index.jade', 'app/views/index.jade');

            //Config Env
            this.copy('config/env/all.js', 'config/env/all.js');
            this.copy('config/env/development.json', 'config/env/development.json');
            this.copy('config/env/production.json', 'config/env/production.json');
            this.copy('config/env/test.json', 'config/env/test.json');
            this.copy('config/env/travis.json', 'config/env/travis.json');

            //config 
            this.copy('config/config.js', 'config/config.js');
            if (this.includeMongooes && this.includeSass) {
                this.copy('config/express_mongooes_sass.js', 'config/express.js');
            } else if (this.includeSass) {
                this.copy('config/express_sass.js', 'config/express.js');
            } else if (this.includeMongooes) {
                this.copy('config/express_mongooes.js', 'config/express.js');
            } else {
                this.copy('config/express.js', 'config/express.js');
            }
            this.copy('config/routes.js', 'config/routes.js');
            this.copy('server.js', 'server.js');

            var projectDir = this.sourceRoot() //process.cwd();

            var footPath = projectDir + "/app/views/includes/foot.jade",
                footFile = readFile.readFileAsString(footPath);

            var headPath = projectDir + "/app/views/includes/head.jade",
                headFile = readFile.readFileAsString(headPath);

            var pakagePath = projectDir + "/_package.json",
                pakageFile = readFile.readFileAsString(pakagePath);
            var pakage = JSON.parse(pakageFile);


            if (this.includeUnderscore && footFile) {
                footFile += "\n script(type = 'text/javascript', src = '/lib/underscore/underscore.js')";

            }
            if (this.includeMoment && footFile) {
                footFile += "\n script(type = 'text/javascript', src = '/lib/moment/moment.js')";
            }
            if (this.includeBootstrap && footFile) {
                footFile += "\n link(rel='stylesheet', href='/lib/bootstrap/dist/css/bootstrap.min.css')";
                footFile += "\n script(type = 'text/javascript', src = '/lib/bootstrap/dist/js/bootstrap.min.js')";
            }
            if (this.includeSass && footFile) {
                footFile += "\n script(type = 'text/javascript', src = '/lib/bootstrap-sass/assets/javascripts/bootstrap.min.js')";
            }

            if (this.includeSass && headFile) {
                headFile += "\n link(rel='stylesheet', href='/styles/app.css')";
            }

            if (pakage.dependencies) {
                if (this.includeMongooes) {
                    pakage.dependencies['mongoose'] = 'latest';
                    pakage.dependencies['connect-mongo'] = '0.8.2';
                    pakage.dependencies['express-session'] = 'latest';

                }
                if (this.includeMongoosastic) {
                    pakage.dependencies['mongoosastic'] = 'latest';
                }
                if (this.includeSass) {
                    pakage.dependencies['node-sass-middleware'] = 'latest';
                }
            }
            this.write('package.json', JSON.stringify(pakage, null, 2));

            this.write('app/views/includes/foot.jade', footFile);
            this.write('app/views/includes/head.jade', headFile);
            //this.copy('app/views/includes/head.jade', 'app/views/includes/head.jade')
            //this.copy('app/views/includes/foot.jade', 'app/views/includes/foot.jade');
        }
    },
    install: function() {
        var howToInstall =
            '\nAfter running ' +
            chalk.yellow.bold('npm install & bower install') + '.';

        if (this.options['skip-install']) {
            this.log(howToInstall);
            return;
        }
        this.installDependencies({
            skipMessage: this.options['skip-install-message'],
            skipInstall: this.options['skip-install'],
            callback: function() {

            }.bind(this)
        });

        this.on('end', function() {
            console.log("Happy Coding !!!");
            console.log(this.sourceRoot())
        }.bind(this));
    }
});

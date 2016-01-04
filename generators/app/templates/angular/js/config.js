'use strict';

//Setting up route
angular.module('baseModel').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        // For unmatched routes:
        $urlRouterProvider.otherwise('/');

        // states for my app
        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    '@': {
                        templateUrl: 'views/index.html'
                    },
                    'header@home': {
                        templateUrl: 'views/header.html',
                    },
                    'footer@home': {
                        templateUrl: 'views/footer.html',
                    }
                }
            })
            .state('user', {
                url: '/user',
                templateUrl: 'views/user/user.html'
            })
    }
]);

//Setting HTML5 Location Mode
angular.module('baseModel').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);

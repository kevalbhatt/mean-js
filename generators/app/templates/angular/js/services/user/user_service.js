'use strict';

angular.module('baseModel')

.service('User_Service', ['$http', function($http) {

    this.getList = function() {
        var promise = $http({
            method: 'GET',
            url: 'url',
            headers: {
                'Accept': 'application/json'
            },
            cache: false
        }).then(function(response) {
            return response;
        });
        return promise;
    }

}]);

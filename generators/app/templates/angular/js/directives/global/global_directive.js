'use strict';


var directiveModule = angular.module('baseModel');

directiveModule.directive("scroll", function($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            if (this.pageYOffset >= 100) {
                scope.boolChangeClass = true;
            } else {
                scope.boolChangeClass = false;
            }
            scope.$apply();
        });
    };
});
directiveModule.directive('onFinishRender', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope,element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});

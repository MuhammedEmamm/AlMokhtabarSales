(function () {
    'use strict';

    angular.module('app').directive('ngMax', ngMax);

    ngMax.$inject = ['$window'];

    function ngMax($window) {
        // Usage:
        //     <ngMax></ngMax>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA',
            require: 'ngModel'
        };
        return directive;

        function link(scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMax, function () {
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var maxValidator = function (value) {
                var max = scope.$eval(attr.ngMax) || Infinity;
                if (!isEmpty(value) && value > max) {
                    ctrl.$setValidity('ngMax', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMax', true);
                    return value;
                }
            };

            ctrl.$parsers.push(maxValidator);
            ctrl.$formatters.push(maxValidator);
        }

    }

})();
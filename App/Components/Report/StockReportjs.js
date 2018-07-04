(function () {
    'use strict';

    angular.module('app').controller('StockReportController', StockReportController);

    StockReportController.$inject = ['$scope', '$rootScope', '$state', '$http','BASE_URL', 'HTTP_HEADERS','$cookies'];

    function StockReportController($scope, $rootScope, $state, $http, AuthService, Session, BASE_URL, HTTP_HEADERS,$cookies) {
		var today = new Date() ; 
		var curmonth = today.getMonth() ; 
        $scope.role = $cookies.getObject('RoleName');
		$scope.stockreport = function(){
			$http({
				            
                method: 'POST',
                url: BASE_URL + '/Stock/GetStockReport',
                data: {
                    "Month": curmonth,
                    "RoleID": $cookies.getObject('RoleID'),
                    "CompanyID": 10
                },
                headers: {
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID')
                }
			}).then(function(response){
				//(response.data) ; 
				$scope.allstcks = response.data.Response ; 
			},
			function(response){
				//("ERROR") ; 	
			})
		} ; 
		$scope.stockreport() ;
		$scope.getmanglist = function() {
				$http({
				            
                method: 'POST',
                url: BASE_URL + '/SalesRep/GetManagerList',
                data: {
                    "CompanyID": 10
                },
                headers: {
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID')
                }
			}).then(function(response){
				//(response.data) ; 
				$scope.allmangs = response.data.Response ; 
			},
			function(response){
				//("ERROR") ; 	
			})
		} ; 
		$scope.getmanglist()  ;
    }
})();

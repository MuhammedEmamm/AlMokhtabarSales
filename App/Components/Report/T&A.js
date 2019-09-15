(function () {
    'use strict';

    angular.module('app').controller('TAReportController', TAReportController);

    TAReportController.$inject = ['$scope', '$rootScope', '$state', '$http','BASE_URL', 'HTTP_HEADERS','$cookies'];

    function TAReportController(  $scope, $rootScope, $state, $http, BASE_URL, HTTP_HEADERS,$cookies) {
			
		if($cookies.getObject('isloggedin')!== 'true'){
				$state.go('Login') ; 
			}
		var today = new Date() ; 
		var curmonth = today.getMonth() ; 
        $scope.role = $cookies.getObject('RoleName');
		$scope.Name= $cookies.getObject('FullName');
		$scope.SalesRepID = '6c699f76-e696-e711-80f5-000c29c47db9' ; 
		$scope.tareport = function(){
			   $http({
                method: 'POST',
                url: BASE_URL + '/Visit/GetCustomerReport',
                data: {
                    "StartDate": '01/01/2000',
                    "EndDate": '01/01/2030',
                    "RoleID": $cookies.getObject('RoleID'),
                    "CompanyID": 10
                },
                headers: {
      
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID') , 
					'X-Frame-Options' : 'DENY'
                }
            }).then(function (res) {
             //console.log(res.data);
				$scope.report = res.data.Response;
            });
			
			$http({
                method: 'POST',
                url: BASE_URL + '/Visit/GetCustomerReport',
                data: {
                    "StartDate": '01/01/2000',
                    "EndDate": '01/01/2030',
                    "RoleID": $scope.SalesRepID,
                    "CompanyID": 10
                },
                headers: {
      
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID') , 
					'X-Frame-Options' : 'DENY'
                }
            }).then(function (res) {
            // console.log(res.data);
				$scope.report = $scope.report.concat(res.data.Response) ; 
				
				console.log($scope.report) ; 
            });
		} ; 
		$scope.tareport() ;
		$scope.getSaleslist = function() {
				$http({
				            
                method: 'POST',
                url: BASE_URL + '/SalesRep/GetSalesRepList',
                data: {
					"UserID" : $cookies.getObject('UserID') ,
                    "CompanyID": 10
                },
                headers: {
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID')
                }
			}).then(function(response){
				console.log(response.data) ; 
				$scope.allSalesRep = response.data.Response ; 
			},
			function(response){
				//("ERROR") ; 	
			})
		} ; 
		$scope.getSaleslist()  ;
    }
})();

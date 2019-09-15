(function () {
	'use strict';

	angular.module('app').controller('TodayVisitsCtrl', TodayVisitsCtrl);

	TodayVisitsCtrl.$inject = ['$scope', '$rootScope', '$state', '$http', 'BASE_URL','$cookies'];

	function TodayVisitsCtrl($scope, $rootScope, $state, $http, BASE_URL,$cookies) {
			if($cookies.getObject('isloggedin')!== 'true'){
				$state.go('Login') ; 
			}
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!
		var yyyy = today.getFullYear();

		if (dd < 10) {
			dd = '0' + dd
		}
		if (mm < 10) {
			mm = '0' + mm
		}

		today = mm + '/' + dd + '/' + yyyy;
		$scope.visitsdate = today;
		$http({
			method: "POST",
			url: BASE_URL + "/Visit/GetVisitsByDay",
			
			headers: {
		
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID') , 
					'X-Frame-Options' : 'DENY'
			},
			data: {
				day: $scope.visitsdate,
				"UserID": $cookies.getObject('UserID'),
				CompanyID: 10
			}
		}).then(function (response) {
				$scope.todayvisits  = response.data.Response ; 
				//console.log($scope.todayvisits) ; 
			},
			function (response) {
				//console.log("error from the server");
			});
	}
})();

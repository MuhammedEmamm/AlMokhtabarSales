(function () {
    'use strict';

    angular.module('app').controller('ReportListController', ReportListController);

    ReportListController.$inject = ['$scope', '$rootScope', '$state', '$http','BASE_URL', 'HTTP_HEADERS','$cookies'];

    function ReportListController($scope, $rootScope, $state, $http, BASE_URL, HTTP_HEADERS,$cookies) {

        $scope.role = $cookies.getObject('RoleName');

        //var dateString = date.toISOString().split('T')[0]; // "2016-06-08"

        $scope.fromDate = new Date();
        $scope.toDate = new Date();

        $scope.fromDate.setDate($scope.fromDate.getDate() - 30);

        var thisMonth = new Date().getMonth() + 1;
        var thisYear = new Date().getFullYear();

        function innerTextFunction(textCtx, doughnutData) {
            var canvasWidthvar = $('#avtCanvas').width();
            var canvasHeight = $('#avtCanvas').width();
            var constant = 114;
            var fontsize = (canvasHeight / constant).toFixed(2);
            textCtx.font = fontsize + "em Verdana";
            textCtx.textBaseline = "middle";
            var total = 0;
            $.each(doughnutData, function () {
                total += parseInt(this.value, 10);
            });
            var tpercentage = ((doughnutData[0].value / total) * 100).toFixed(2) + "%";
            var textWidth = textCtx.measureText(tpercentage).width;
            var txtPosx = Math.round((canvasWidthvar - textWidth) / 2);
            textCtx.fillText(tpercentage, txtPosx, canvasHeight / 4);
        }

        var getDashboard = function () {
            $http({
                method: 'POST',
                url: BASE_URL + '/Visit/GetDashboard',
                data: {
                    "userType": $cookies.getObject('RoleName'),
                    "Month": thisMonth,
                    "Year": thisYear,
                    "RoleID": $cookies.getObject('RoleID'),
                    "CompanyID": 10
                },
                headers: {
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID')
                }
            }).then(function (res) {
                //(res.data);
                $scope.AVT = res.data.Response.AverageVisitTime;
                $scope.targetAVT = res.data.Response.TargetAverageVisitTime;
                $scope.targetVisit = res.data.Response.TargetVisits;
                $scope.Achieved = res.data.Response.Achieved;
                $scope.achievedPercent = $scope.Achieved * 100 / $scope.targetVisit;
                $scope.missedVisits = res.data.Response.MissedVisits;
                $scope.balance = res.data.Response.TotalBalance;
                $scope.stock = res.data.Response.TotalStock;
				$scope.actualamount = res.data.Response.ActualAmount ; 
				$scope.targetamount = res.data.Response.TargetAmount ;

            });
        }
        var getMissed = function () {

            //(thisMonth, thisYear);

            $http({
                method: 'POST',
                url: BASE_URL + '/Visit/GetMissedVisits',
                data: {
                    "Month": thisMonth,
                    "Year": thisYear,
                    "CompanyID": 10
                },
                headers: {
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID')
                }
            }).then(function (res) {
                //(res.data);
                $scope.missed = res.data.Response;
            });
        };
        var getReasons = function () {
            $http({
                method: 'POST',
                url: BASE_URL + '/Visit/GetCancelReason',
                data: {
                    "CompanyID": 10
                },
                headers: {
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID')
                }
            }).then(function (res) {
                //(res.data);
                $scope.reasons = res.data.Response;
            });
        };
        var getCustomerReport = function (fromDate, toDate) {
            $http({
                method: 'POST',
                url: BASE_URL + '/Visit/GetCustomerReport',
                data: {
                    "StartDate": fromDate,
                    "EndDate": toDate,
                    "RoleID": $cookies.getObject('RoleID'),
                    "CompanyID": 10
                },
                headers: {
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID')
                }
            }).then(function (res) {
             //   console.log(res.data);
				$scope.report = res.data.Response;
            });
        };

        $scope.showCancel = function (visitId) {
            $('#myModal').modal('show');
            $('body').addClass('modal-open');
            $('.modal-backdrop').add();

            $scope.deleteVisit = function () {
                $http({
                    method: 'POST',
                    url: BASE_URL + '/Visit/CancelVisit',
                    data: {
                        "VisitID": visitId,
                        "CancelReasonID": $scope.reason,
                        "CompanyID": 10
                    },
                    headers: {
                        "content-type": "Application/json",
                        "Token": $cookies.getObject('SecurityToken'),
                        "UserID": $cookies.getObject('UserID')
                    }
                }).then(function (res) {
                    if (res.data.IsSuccess) {
                        $('#myModal').modal('hide');

                        $('#okModal').modal('show');
                        getMissed();
                    }

                });
            };
        };

        $scope.updateDates = function () {
		//	console.log($scope.fromDate) ;
		//		console.log($scope.toDate) ; 
            	
			if($scope.fromDate.getMonth() === $scope.toDate.getMonth() && $scope.fromDate.getDate() === $scope.toDate.getDate()&& $scope.fromDate.getFullYear() === $scope.toDate.getFullYear() ){
				
				$scope.fromDate.setHours(0) ; 
				$scope.fromDate.setMinutes(0) ; 
				$scope.fromDate.setSeconds(0) ; 
				
				$scope.toDate.setHours(23) ;
				$scope.toDate.setMinutes(59) ;
				$scope.toDate.setSeconds(59) ;
				
			}
				
			
			getCustomerReport($scope.fromDate, $scope.toDate);
        }

        getDashboard();
        if ($cookies.getObject('RoleName') === 'SalesRep') {
            getMissed();
            getReasons();
        } 
		else {
            getCustomerReport($scope.fromDate, $scope.toDate);
        }

    }
})();

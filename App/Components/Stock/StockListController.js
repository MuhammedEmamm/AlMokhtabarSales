(function () {
    'use strict';

    angular.module('app').controller('StockListController', StockListController);

    StockListController.$inject = ['$scope', '$rootScope', '$state', '$http','BASE_URL', 'HTTP_HEADERS','$cookies'];

    function StockListController($scope, $rootScope, $state, $http, BASE_URL, HTTP_HEADERS,$cookies) {
	if($cookies.getObject('isloggedin')!== 'true'){
				$state.go('Login') ; 
			}
        $scope.role =$cookies.getObject('RoleName');

        $scope.stock = {
            ToUserID: "",
            Quantity: 0,
            Item: {
                Balance: 0,
                ID: "",
                Name: ""
            }
        };

        var thisMonth = new Date().getMonth() + 1;
        var thisYear = new Date().getFullYear();

        var getStockReport = function () {
            $http({
                method: 'POST',
                url: BASE_URL + '/Stock/GetStockReport',
                data: {
                    "Year": thisYear,
                    "Month": thisMonth,
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
                //(res.data);
                $scope.stockList = res.data.Response;
            });
        };
        var getReps = function () {

            $http({
                method: 'POST',
                url: BASE_URL + '/SalesRep/GetTeam',
                data: {
                    "CompanyID": 10
                },
                headers: {
            
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID')
                }
            }).then(function (res) {
                $scope.reps = res.data.Response;
                $scope.reps = $scope.reps.filter(function (i) { return i.Status === 'Activated' });
            });
        }
        var getManagers = function () {
            $http({
                method: 'POST',
                url: BASE_URL + '/SalesRep/GetManagerList',
                data: {
                    "CompanyID": 10
                },
                headers: {
           
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID') , 
					'X-Frame-Options' : 'DENY'
                }
            }).then(function (res) {
                $scope.managers = res.data.Response;
                //(res.data);
            });
        };
        var getCategories = function () {
            $http({
                method: 'POST',
                url: BASE_URL + '/Stock/GetStockCategory',
                data: {
                    "CompanyID": 10
                },
                headers: {
             
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID') , 
					'X-Frame-Options' : 'DENY'
                }
            }).then(function (res) {
                //(res.data);
                $scope.categories = res.data.Response;
            });
        };
        $scope.getItems = function (categoryId) {
            //(categoryId);
            $http({
                method: 'POST',
                url: BASE_URL + '/Stock/GetStockItems',
                data: {
                    "CategoryID": categoryId,
                    "CompanyID": 10
                },
                headers: {
     
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID') , 
					'X-Frame-Options' : 'DENY'
                }
            }).then(function (res) {
                //(res.data);
                $scope.items = res.data.Response;
            });
        };

        $scope.submitStock = function () {
            //($scope.stock);
            //($scope.stockForm);

            $http({
                method: 'POST',
                url: BASE_URL + '/Stock/AssignStockItem',
                data: {
                    "ItemID": $scope.stock.Item.ID,
                    "ToUserID": $scope.stock.ToUserID,
                    "Qty": $scope.stock.Quantity,
                    "CompanyID": 10
                },
                headers: {
             
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID') , 
					'X-Frame-Options' : 'DENY'
                }
            }).then(function (res) {
                //(res.data);
                if (res.data.IsSuccess) {
                    $('#myModal').modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    getStockReport();
                }
            });
        };


        getStockReport();
        getManagers();
        getReps();
        getCategories();
    }
})();

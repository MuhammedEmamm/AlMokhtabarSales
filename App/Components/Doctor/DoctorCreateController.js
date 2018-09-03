(function () {
    'use strict';

    angular.module('app')
        .controller('DoctorCreateController', DoctorCreateController);

    DoctorCreateController.$inject = ['$scope', '$rootScope', '$state', '$http','BASE_URL', 'HTTP_HEADERS', '$cookies'];

    function DoctorCreateController($scope, $rootScope, $state, $http, BASE_URL, HTTP_HEADERS , $cookies) {
      		if($cookies.getObject('isloggedin')!== 'true'){
				$state.go('Login') ; 
			}
		
		$scope.totalDisplayed = 20;
		$scope.show = false ; 
		
		
        var getOrgs = function () {

            $http({
                method: 'POST',
                url: BASE_URL + '/Doctor/GetOrgList',
                data: {
                    "DoctorID": "8CD32714-C0A2-41D4-BB53-C700D7F98756",
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
                $scope.orgs = res.data.Response;
				$scope.show = true ; 
            });

        };
		
        $scope.loadMore = function () {
            $scope.totalDisplayed += 20;
		};

        var getSpecs = function () {

            $http({
                method: 'POST',
                url: BASE_URL + '/Doctor/GetSpecialities',
                data: { "CompanyID": 10 },
                headers: {
                    "content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID'),
					'X-Frame-Options' : 'DENY'
                }
            }).then(function (res) {
                //(res.data);
                $scope.specs = res.data.Response;
            });


        };


        var getCategories = function () {

            $http({
                method: 'POST',
                url: BASE_URL + '/Doctor/GetDoctorCategory',
                data: { "CompanyID": 10 },
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

        $scope.selectedOrgs = [];

        $scope.updateOrgs = function (org) {
            if (org.select === true) {
                $scope.selectedOrgs.push(org.ID);
            } else if (org.select === false) {
                $scope.selectedOrgs = $scope.selectedOrgs.filter(function (i) { return i !== org.ID });
            }
            //($scope.selectedOrgs);
        };

        $scope.submitDr = function () {
            $scope.doctor.rep = $cookies.getObject('RoleID');
            for (var i = 0 ; i < $scope.specs.length ; i++) {
                if ($scope.doctor.spec === $scope.specs[i].SpecialityID) {
                    $scope.doctor.specname = $scope.specs[i].SpecialityName;
                }
            }
            for (var i = 0 ; i < $scope.categories.length ; i++) {
                if ($scope.doctor.category === $scope.categories[i].ID) {
                    $scope.doctor.categoryname = $scope.categories[i].Name; 
                }
            }

            $scope.doctor.orgs = $scope.selectedOrgs;
            //($scope.doctor);
            $http({
                method: 'POST',
                url: BASE_URL + '/Doctor/CreateDoctor',
                data: {
                    "UserName": $cookies.getObject("FullName") ,
                    "Name": $scope.doctor.name,
                    "SpecialityID": $scope.doctor.spec,
                    "SpecialityName": $scope.doctor.specname,
                    "CategoryName": $scope.doctor.categoryname,
                    "CategoryID": Number($scope.doctor.category),
                    "UserID": $scope.doctor.rep,
                    "Orgs": $scope.doctor.orgs,
                    "Mobile": $scope.doctor.mob,
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
                    $state.go('RequestsList');
                }
            });
        };

        $scope.submitOrg = function () {
            //($scope.org);
            $http({
                method: 'POST',
                url: BASE_URL + '/Doctor/CreateOrg',
                data: {
                    "Name": $scope.newOrg.name,
                    "Address": $scope.newOrg.address,
                    "Contact": $scope.newOrg.contact,
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
                    getOrgs();
                }
            });
        };

        getOrgs();
        getSpecs();
        getCategories();

        $scope.user = $rootScope.currentUser;
        $scope.role =$cookies.getObject('RoleName');
        //(Session.roleName);
        //($scope.role);

        $scope.logout = function () {
			$cookies.remove('isloggedin') ;
            AuthService.logout();
            $state.go('Login');
        };
    }
})();

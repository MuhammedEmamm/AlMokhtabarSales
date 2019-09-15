(function () {
	'use strict';

	angular.module('app').factory('AuthService', AuthService);

	AuthService.$inject = ['$rootScope', '$http', 'BASE_URL', 'HTTP_HEADERS', '$cookies', 'AUTH_EVENTS'];

	function AuthService($rootScope, $http, BASE_URL, HTTP_HEADERS, $cookies, AUTH_EVENTS) {
		var authService = {};
		var expiresdate = new Date(2040, 12, 1);
		var a, b;
		authService.login = function (credentials, x , y) {
			console.log(y) ; 
			if(y === 3){
				var loginData = {		
				"Name": credentials.username,
				"Password": credentials.password,
				"DeviceToken": "",
				"CompanyID": 10,
				"Louck": 1,
				"employeeID": "6c699f76-e696-e711-80f5-000c29c47db9"
			};
				
			}
			else{
				var loginData = {		
				"Name": credentials.username,
				"Password": credentials.password,
				"DeviceToken": "",
				"CompanyID": 10,
				"Louck": 0,
				"employeeID": "6c699f76-e696-e711-80f5-000c29c47db9"
			};
				
			}
			

			return $http({
				method: 'POST',
				url: BASE_URL + '/User/Login',
				data: loginData,
				headers: HTTP_HEADERS
			}).then(function (res) {

				authService.RoleName = res.data.Response.RoleName;
				authService.UserID = res.data.Response.UserID;
				$cookies.putObject('ZX_A', res.data.Response.UserID);
				$cookies.putObject('MK_L', res.data.Response.RoleName);



				if (x) {

					$cookies.putObject('SecurityToken', res.data.Response.SecurityToken, {
						'expires': (expiresdate)
					});
					$cookies.putObject('UserID', res.data.Response.UserID, {
						'expires': (expiresdate)
					});
					$cookies.putObject('FullName', res.data.Response.FullName, {
						'expires': (expiresdate)
					});
					$cookies.putObject('ImageURL', res.data.Response.ImageURL, {
						'expires': (expiresdate)
					});
					$cookies.putObject('RoleID', res.data.Response.RoleID, {
						'expires': (expiresdate)
					});
					$cookies.putObject('RoleName', res.data.Response.RoleName, {
						'expires': (expiresdate)
					});
					$cookies.putObject('Remme', "true", {
						'expires': (expiresdate)
					});
					$cookies.putObject('SUB_NOTIFY', 0, {
						'expires': (expiresdate)
					});

				} else {

					$cookies.putObject('SecurityToken', res.data.Response.SecurityToken);
					$cookies.putObject('UserID', res.data.Response.UserID);
					$cookies.putObject('FullName', res.data.Response.FullName);
					$cookies.putObject('ImageURL', res.data.Response.ImageURL);
					$cookies.putObject('RoleID', res.data.Response.RoleID);
					$cookies.putObject('RoleName', res.data.Response.RoleName);
					$cookies.putObject('SUB_NOTIFY', 0);

				}

			});
		};

		authService.logout = function () {
			$cookies.remove('SecurityToken');
			$cookies.remove('UserID');
			$cookies.remove('FullName');
			$cookies.remove('ImageURL');
			$cookies.remove('RoleID');
			$cookies.remove('RoleName');
			$cookies.remove('Remme');
			$cookies.remove('isloggedin');
			$cookies.remove('ZX_A');
			$cookies.remove('MK_L');
			
			
		};


		authService.isAuthorized = function (authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}
			return (authService.isAuthenticated() &&
				authorizedRoles.indexOf(Session.userRole) !== -1);
		};


		return authService;
	}

})();

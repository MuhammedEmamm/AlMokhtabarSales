(function () {
    'use strict';

    angular.module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$rootScope', '$state', 'AUTH_EVENTS', 'AuthService' , '$cookies'];

    function LoginController($scope, $rootScope, $state, AUTH_EVENTS, AuthService , $cookies) {
		$scope.Presslogin = false ; 
		
        $scope.credentials = {
            username: '',
            password: ''
        };
		if($cookies.getObject("Remme")){
			$state.go('DoctorsList') ; 
		}

        $scope.login = function (credentials) {
			$scope.Presslogin = true ; 
            AuthService.login(credentials , $scope.remme).then(function (user) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $state.go('DoctorsList');

            }, function () {
                console.log('failed');
						$scope.Presslogin = false ; 

                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                $scope.invalidMsg = "Invalid username or password.";
            });
        };
		

    }
})();

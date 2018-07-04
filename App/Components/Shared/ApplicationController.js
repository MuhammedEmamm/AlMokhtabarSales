(function () {
    'use strict';

    angular.module('app')
        .controller('ApplicationController', ApplicationController);

    ApplicationController.$inject = ['$scope', '$rootScope','AuthService', 'BASE_URL', '$state', '$http', '$cookies','AUTH_EVENTS'];

    function ApplicationController($scope, $rootScope, AuthService, BASE_URL, $state, $http, $cookies,AUTH_EVENTS) {
		var expiresdate = new Date(2040,12,1);
		$state.go('Login') ; 

		$scope.oldest = [] ; 
		$scope.oldest.push(-1) ; 
		//le.log($scope.oldest) ; 
			if($cookies.getObject('isloggedin')=="true"){
				$scope.role = $cookies.getObject('RoleName');
            	$scope.userName = $cookies.getObject('FullName');
				$scope.ppUrl = $cookies.getObject('ImageURL');
			}
			

        $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.role = $cookies.getObject('RoleName');
            $scope.userName = $cookies.getObject('FullName');
            $scope.ppUrl = $cookies.getObject('ImageURL');
			if($cookies.getObject('Remme'))
			$cookies.putObject('isloggedin',"true"  , {
						'expires': (expiresdate)
					}) ; 
			else 
				
				$cookies.putObject('isloggedin' , "true") ; 
            //($scope.userName);
        });
		
		$scope.aft7 = function(){
		if($cookies.getObject('Remme'))
						$cookies.putObject('SUB_NOTIFY' , 0 , {
						'expires': (expiresdate)
					}) ; 
			else 
				$cookies.putObject('SUB_NOTIFY' , 0 ) ; 
					
			$scope.sub = 0 ; 
			$scope.oldest = $scope.List ; 
          $('#wrapper').toggleClass('right-bar-enabled');
			

};

		 $scope.playAudio = function() {
		 	 var audio = new Audio('/Assets/Notify.mp3');
			 audio.play() ;
    	};
		
		$scope.GetNotification = function() {
			$http({
				method:"POST",
				url: BASE_URL + "/Visit/GetNotifications",
				headers:{
					"content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID')
				},
				data:{
					"CompanyID" : 10 
				}
			}).then(function(response){
					//($scope.List) ; 
					$scope.sub = $cookies.getObject('SUB_NOTIFY'); 

				if($scope.oldest[0] === -1){
					$scope.oldest = response.data.Response ; 
					//le.log(1) ; 
				}
				else if ($scope.oldest.length < response.data.Response.length){
					
					if($cookies.getObject('Remme'))
						$cookies.putObject('SUB_NOTIFY' , response.data.Response.length - $scope.oldest.length , {
						'expires': (expiresdate)
					}) ; 
					else 
						$cookies.putObject('SUB_NOTIFY' , response.data.Response.length - $scope.oldest.length ) ; 
					$scope.sub = $cookies.getObject('SUB_NOTIFY');
									$scope.playAudio() ; 	

					//le.log(2) ; 
					//le.log($scope.sub) ; 
				}
			
				$scope.List = response.data.Response ; 
				if($scope.List!=undefined&&$scope.List!=null)
				$scope.List = $scope.List.reverse() ;
			})
		} ;	
			if($cookies.getObject('isloggedin')=="true"){
				$scope.GetNotification() ; 
		
			}
		
		setInterval(function(){
			
		if($cookies.getObject('isloggedin')=="true"){
				$scope.GetNotification() ; 
		
			}
		}, 120000)
		
		setInterval(function(){
			console.clear()
		} , 5000) ; 
		
		
		
        $rootScope.logout = function () {
			AuthService.logout();
            $state.go('Login');
        };
    }
})();

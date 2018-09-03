(function () {
    'use strict';

    var app = angular.module('app', ['ui.router', 'ui.bootstrap','ngCookies','google-maps','ngIdle']);

    app.config(function ($stateProvider, $urlRouterProvider, USER_ROLES , $locationProvider , KeepaliveProvider, IdleProvider) {
         IdleProvider.idle(10);
  		IdleProvider.timeout(10);
		KeepaliveProvider.interval(10);
		$urlRouterProvider.otherwise('/Login');
		   $locationProvider.hashPrefix('');
			  //      $locationProvider.html5Mode(true);

        $stateProvider
       .state("Login", {
                url: '/Login',
                templateUrl: "App/Components/Account/Login.html",
                controller: "LoginController",
                data: {
                    pageTitle: "Login",
                    pageType: "full"
                }
            })
       .state("Recover", {
                url: '/Recover',
                templateUrl: "App/Components/Account/Recover.html",
                controller: "RecoverController",
                data: {
                    pageTitle: "Password Recovery",
                    pageType: "full"
                }
            })	
       .state("DoctorsList", {
                url: '/Doctor/List',
                templateUrl: "App/Components/Doctor/List.html",
                controller: "DoctorListController",
                data: {
                    pageTitle: "Doctors",
                    pageType: "partial",
                    pageId: "doctorList"
                }
            })
       .state("DoctorsCreate", {
             url: '/Doctor/Create',
             templateUrl: "App/Components/Doctor/Create.html",
             controller: "DoctorCreateController",
             data: {
                 pageTitle: "New Doctor",
                 pageType: "partial",
                 pageId: "doctorCreate",
             }
         })
       .state("RequestsList", {
            url: '/Request/List',
            templateUrl: "App/Components/Request/List.html",
            controller: "RequestListController",
            data: {
                pageTitle: "Pending Requests",
                pageType: "partial",
                pageId: "requests"
            }
        })
       .state("TeamList", {
              url: '/Team/List',
              templateUrl: "App/Components/Team/List.html",
              controller: "TeamListController",
              data: {
                  pageTitle: "My Team",
                  pageType: "partial",
                  pageId: "team"
              }
          })
	   .state("TodayVisits", {
              url: '/Visits/Todayvisits',
              templateUrl: "App/Components/Visits/Todayvisits.html",
              controller: "TodayVisitsCtrl",
              data: {
                  pageTitle: "TodayVisits",
                  pageType: "partial",
                  pageId: "visits"
              }
          })
	   .state("VisitPlan", {
              url: '/Visits/VisitPlan',
              templateUrl: "App/Components/Visits/VisitPlan.html",
              controller: "VisitPlanCtrl",
              data: {
                  pageTitle: "VisitPlan",
                  pageType: "partial",
                  pageId: "plan"
              }
          })
	   .state("VisitPlanCreate", {
              url: '/Visits/VisitPlanCreate',
              templateUrl: "App/Components/Visits/VisitPlanCreate.html",
              controller: "VisitPlanCreateCtrl",
              data: {
                  pageTitle: "VisitPlanCreate",
                  pageType: "partial",
                  pageId: "plan"
              }
          })		
       .state("Report", {
            url: '/Report/List',
            templateUrl: "App/Components/Report/List.html",
            controller: "ReportListController",
            data: {
                pageTitle: "My Reports",
                pageType: "partial",
                pageId: "report"
            }
        })
       .state("StockReport", {
            url: '/Report/StockReport',
            templateUrl: "App/Components/Report/StockReport.html",
            controller: "StockReportController",
            data: {
                pageTitle: "My Reports",
                pageType: "partial",
                pageId: "report"
            }
        })
	   .state("AVTReport", {
            url: '/Report/AVTReport',
            templateUrl: "App/Components/Report/AvtReport.html",
            controller: "AvtReportController",
            data: {
                pageTitle: "My Reports",
                pageType: "partial",
                pageId: "report"
            }
        })
	   .state("DetailedAmount", {
            url: '/Report/DetailedAmount',
            templateUrl: "App/Components/Report/DetailedAmount.html",
            controller: "DetailedAmountController",
            data: {
                pageTitle: "My Reports",
                pageType: "partial",
                pageId: "report"
            }
        })
       .state("Stock", {
            url: '/Stock/List',
            templateUrl: "App/Components/Stock/List.html",
            controller: "StockListController",
            data: {
                pageTitle: "My Stock",
                pageType: "partial",
                pageId: "stock"
            }
        })
        ;
    });

//    app.config(function ($httpProvider) {
//        $httpProvider.interceptors.push([
//            '$injector',
//            function ($injector) {
//                return $injector.get('AuthInterceptor');
//            }
//        ]);
//    });

    app.run(['$rootScope', '$state', '$stateParams', 'AUTH_EVENTS', 'AuthService',
        function ($rootScope, $state, $stateParams, AUTH_EVENTS, AuthService) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
			$rootScope.login = false;
						
			//$state.go('Login'); 
            $rootScope.$on('$stateChangeStart', function (event, next) {
                var authorizedRoles = next.data.authorizedRoles;
                if (!AuthService.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    if (AuthService.isAuthenticated()) {
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    } else {
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                    }
                }
            });
        }
    ]);

	(function () {
  
  "use strict";
  
  /*
   * Utility functions
   */
  
  /**
   * Check if 2 floating point numbers are equal
   * 
   * @see http://stackoverflow.com/a/588014
   */
  function floatEqual (f1, f2) {
    return (Math.abs(f1 - f2) < 0.000001);
  }
  
  /* 
   * Create the model in a self-contained class where map-specific logic is 
   * done. This model will be used in the directive.
   */
  
  var MapModel = (function () {
    
    var _defaults = { 
        zoom: 8,
        draggable: false,
        container: null
      };
    
    /**
     * 
     */
    function PrivateMapModel(opts) {
      
      var _instance = null,
        _markers = [],  // caches the instances of google.maps.Marker
        _handlers = [], // event handlers
        _windows = [],  // InfoWindow objects
        o = angular.extend({}, _defaults, opts),
        that = this,
        currentInfoWindow = null;
      
      this.center = opts.center;
      this.zoom = o.zoom;
      this.draggable = o.draggable;
      this.dragging = false;
      this.selector = o.container;
      this.markers = [];
      this.options = o.options;
      
      this.draw = function () {
        
        if (that.center == null) {
          // TODO log error
          return;
        }
        
        if (_instance == null) {
          
          // Create a new map instance
          
          _instance = new google.maps.Map(that.selector, angular.extend(that.options, {
            center: that.center,
            zoom: that.zoom,
            draggable: that.draggable,
            mapTypeId : google.maps.MapTypeId.ROADMAP
          }));
          
          google.maps.event.addListener(_instance, "dragstart",
              
              function () {
                that.dragging = true;
              }
          );
          
          google.maps.event.addListener(_instance, "idle",
              
              function () {
                that.dragging = false;
              }
          );
          
          google.maps.event.addListener(_instance, "drag",
              
              function () {
                that.dragging = true;   
              }
          );  
          
          google.maps.event.addListener(_instance, "zoom_changed",
              
              function () {
                that.zoom = _instance.getZoom();
                that.center = _instance.getCenter();
              }
          );
          
          google.maps.event.addListener(_instance, "center_changed",
              
              function () {
                that.center = _instance.getCenter();
              }
          );
          
          // Attach additional event listeners if needed
          if (_handlers.length) {
            
            angular.forEach(_handlers, function (h, i) {
              
              google.maps.event.addListener(_instance, 
                  h.on, h.handler);
            });
          }
        }
        else {
          
          // Refresh the existing instance
          google.maps.event.trigger(_instance, "resize");
          
          var instanceCenter = _instance.getCenter();
          
          if (!floatEqual(instanceCenter.lat(), that.center.lat())
            || !floatEqual(instanceCenter.lng(), that.center.lng())) {
              _instance.setCenter(that.center);
          }
        
          if (_instance.getZoom() != that.zoom) {
            _instance.setZoom(that.zoom);
          }          
        }
      };
      
      this.fit = function () {
        if (_instance && _markers.length) {
          
          var bounds = new google.maps.LatLngBounds();
          
          angular.forEach(_markers, function (m, i) {
            bounds.extend(m.getPosition());
          });
          
          _instance.fitBounds(bounds);
        }
      };
      
      this.on = function(event, handler) {
        _handlers.push({
          "on": event,
          "handler": handler
        });
      };
      
      this.addMarker = function (lat, lng, icon, infoWindowContent, label, url,
          thumbnail) {
        
        if (that.findMarker(lat, lng) != null) {
          return;
        }
        
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: _instance,
          icon: icon
        });
        
        if (label) {
          
        }
        
        if (url) {
          
        }

        if (infoWindowContent != null) {
          var infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent
          });

          google.maps.event.addListener(marker, 'click', function() {
            if (currentInfoWindow != null) {
              currentInfoWindow.close();
            }
            infoWindow.open(_instance, marker);
            currentInfoWindow = infoWindow;
          });
        }
        
        // Cache marker 
        _markers.unshift(marker);
        
        // Cache instance of our marker for scope purposes
        that.markers.unshift({
          "lat": lat,
          "lng": lng,
          "draggable": false,
          "icon": icon,
          "infoWindowContent": infoWindowContent,
          "label": label,
          "url": url,
          "thumbnail": thumbnail
        });
        
        // Return marker instance
        return marker;
      };      
      
      this.findMarker = function (lat, lng) {
        for (var i = 0; i < _markers.length; i++) {
          var pos = _markers[i].getPosition();
          
          if (floatEqual(pos.lat(), lat) && floatEqual(pos.lng(), lng)) {
            return _markers[i];
          }
        }
        
        return null;
      };  
      
      this.findMarkerIndex = function (lat, lng) {
        for (var i = 0; i < _markers.length; i++) {
          var pos = _markers[i].getPosition();
          
          if (floatEqual(pos.lat(), lat) && floatEqual(pos.lng(), lng)) {
            return i;
          }
        }
        
        return -1;
      };
      
      this.addInfoWindow = function (lat, lng, html) {
        var win = new google.maps.InfoWindow({
          content: html,
          position: new google.maps.LatLng(lat, lng)
        });
        
        _windows.push(win);
        
        return win;
      };
      
      this.hasMarker = function (lat, lng) {
        return that.findMarker(lat, lng) !== null;
      };  
      
      this.getMarkerInstances = function () {
        return _markers;
      };
      
      this.removeMarkers = function (markerInstances) {
        
        var s = this;
        
        angular.forEach(markerInstances, function (v, i) {
          var pos = v.getPosition(),
            lat = pos.lat(),
            lng = pos.lng(),
            index = s.findMarkerIndex(lat, lng);
          
          // Remove from local arrays
          _markers.splice(index, 1);
          s.markers.splice(index, 1);
          
          // Remove from map
          v.setMap(null);
        });
      };
    }
    
    // Done
    return PrivateMapModel;
  }());
  
  // End model
  
  // Start Angular directive
  
  var googleMapsModule = angular.module("google-maps", []);

  /**
   * Map directive
   */
  googleMapsModule.directive("googleMap", ["$log", "$timeout", "$filter", function ($log, $timeout, 
      $filter) {

    var controller = function ($scope, $element) {
      
      var _m = $scope.map;
      
      self.addInfoWindow = function (lat, lng, content) {
        _m.addInfoWindow(lat, lng, content);
      };
    };

    controller.$inject = ['$scope', '$element'];
    
    return {
      restrict: "EC",
      priority: 100,
      transclude: true,
      template: "<div class='angular-google-map' ng-transclude></div>",
      replace: false,
      scope: {
        center: "=center", // required
        markers: "=markers", // optional
        latitude: "=latitude", // required
        longitude: "=longitude", // required
        zoom: "=zoom", // required
        refresh: "&refresh", // optional
        windows: "=windows" // optional"
      },
      controller: controller,      
      link: function (scope, element, attrs, ctrl , $scope) {
        
        // Center property must be specified and provide lat & 
        // lng properties
//		  scope.markers = [	] ;
        if (!angular.isDefined(scope.center) || 
            (!angular.isDefined(scope.center.lat) || 
                !angular.isDefined(scope.center.lng))) {
        	
          $log.error("angular-google-maps: Could not find a valid center property");          
          return;
        }
        
        if (!angular.isDefined(scope.zoom)) {
        	$log.error("angular-google-maps: map zoom property not set");
        	return;
        }
        
        angular.element(element).addClass("angular-google-map");

        // Parse options
        var opts = {options: {}};
        if (attrs.options) {
          opts.options = angular.fromJson(attrs.options);
        }
        
        // Create our model
        var _m = new MapModel(angular.extend(opts, {
          container: element[0],            
          center: new google.maps.LatLng(scope.center.lat, scope.center.lng),              
          draggable: attrs.draggable == "true",
          zoom: scope.zoom
        }));       
      
        _m.on("drag", function () {
          
          var c = _m.center;
        
          $timeout(function () {
            
            scope.$apply(function (s) {
              scope.center.lat = c.lat();
              scope.center.lng = c.lng();
            });
          });
        });
      
        _m.on("zoom_changed", function () {
          
          if (scope.zoom != _m.zoom) {
            
            $timeout(function () {
              
              scope.$apply(function (s) {
                scope.zoom = _m.zoom;
              });
            });
          }
        });
      
        _m.on("center_changed", function () {
          var c = _m.center;
        
          $timeout(function () {
            
            scope.$apply(function (s) {
              
              if (!_m.dragging) {
                scope.center.lat = c.lat();
                scope.center.lng = c.lng();
              }
            });
          });
        });
        
        if (attrs.markClick == "true") {
          (function () {
            var cm = null;
            
            _m.on("click", function (e) {                         
              if (cm == null) {
                
                cm = {
                  latitude: e.latLng.lat(),
                  longitude: e.latLng.lng() 
                };
                scope.markers.push(cm);
              }
              else {
                cm.latitude = e.latLng.lat();
                cm.longitude = e.latLng.lng();
              }
              
              
              $timeout(function () {
                scope.latitude = cm.latitude;
                scope.longitude = cm.longitude;
                scope.$apply();
              });
            });
          }());
        }
        
        // Put the map into the scope
        scope.map = _m;
        
        // Check if we need to refresh the map
        if (angular.isUndefined(scope.refresh())) {
          // No refresh property given; draw the map immediately
          _m.draw();
        }
        else {
          scope.$watch("refresh()", function (newValue, oldValue) {
            if (newValue && !oldValue) {
              _m.draw();
            }
          }); 
        }
        
        // Markers
        scope.$watch("markers", function (newValue, oldValue) {
          
          $timeout(function () {
            
            angular.forEach(newValue, function (v, i) {
              if (!_m.hasMarker(v.latitude, v.longitude)) {
                _m.addMarker(v.latitude, v.longitude, v.icon, v.infoWindow);
              }
            });
            
            // Clear orphaned markers
            var orphaned = [];
            
            angular.forEach(_m.getMarkerInstances(), function (v, i) {
              // Check our scope if a marker with equal latitude and longitude. 
              // If not found, then that marker has been removed form the scope.
              
              var pos = v.getPosition(),
                lat = pos.lat(),
                lng = pos.lng(),
                found = false;
              
              // Test against each marker in the scope
              for (var si = 0; si < scope.markers.length; si++) {
                
                var sm = scope.markers[si];
             //   console.log(sm)  ; 
                if (floatEqual(sm.latitude, lat) && floatEqual(sm.longitude, lng)) {
                  // Map marker is present in scope too, don't remove
                  found = true;
					// console.log(sm)  ;
                }
              }
              
              // Marker in map has not been found in scope. Remove.
              if (!found) {
                orphaned.push(v);
              }
            });

            orphaned.length && _m.removeMarkers(orphaned);           
            
            // Fit map when there are more than one marker. 
            // This will change the map center coordinates
            if (attrs.fit == "true" && newValue.length > 1) {
              _m.fit();
            }
          });
          
        }, true);
        
        
        // Update map when center coordinates change
        scope.$watch("center", function (newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          
          if (!_m.dragging) {
            _m.center = new google.maps.LatLng(newValue.lat, 
                newValue.lng);          
            _m.draw();
          }
        }, true);
        
        scope.$watch("zoom", function (newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          
          _m.zoom = newValue;
          _m.draw();
        });
      }
    };
  }]);  
	
}());
    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    app.constant('USER_ROLES', {
        all: '*',
        SalesAdmin: 'SalesAdmin',
        SalesRep: 'SalesRep',
        SalesManager: 'SalesManager'
    });

    app.constant('BASE_URL', 'http://yakensolution.cloudapp.net:80/IDHSales/api');

    app.constant('HTTP_HEADERS', {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Methods': "GET,PUT,POST,DELETE"
    });
	

})();
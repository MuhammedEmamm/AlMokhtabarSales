(function () {
	'use strict';

	angular.module('app').controller('VisitPlanCtrl', VisitPlanCtrl);

	VisitPlanCtrl.$inject = ['$scope', '$rootScope', '$state', '$http', 'BASE_URL', '$cookies'];

	function VisitPlanCtrl($scope, $rootScope, $state, $http, BASE_URL, $cookies) {
		var today = new Date();
		var mm = today.getMonth() + 1; //January is 0!
		var yy = today.getFullYear();
		$scope.day = today.getDate() ; 
		////($scope.day) ;//(today) ; 
		$scope.loadvisits=false  ; 
		
		$scope.role = $cookies.getObject('RoleName');
		$scope.ID = $cookies.getObject('UserID') ;
		$scope.currentID = $scope.ID ;
		//($scope.role);
		$('#mapDate').datepicker({
			    format: "mm-yyyy",
    startView: "months", 
    minViewMode: "months"
		}); ; 
		

		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		for (var i = 0; i < monthNames.length; i++) {
			if ((i + 1) === mm) {
				$scope.curmonth = monthNames[i];
				break;
			}
		}
		if (mm === 12) {
			$scope.nexmonth = 1;
			$scope.nextyear = yy + 1;
		} else {
			$scope.nexmonth = mm + 1;
			$scope.nextyear = yy;
		}

		$scope.GetNextMonthStatus = function () {
			$http({
				method: "POST",
				url: BASE_URL + "/Visit/GetPlanVisits",
				headers: {
					"Content-Type": "application/json",
					"Token": $cookies.getObject('SecurityToken'),
					"UserID": $cookies.getObject('UserID')
				},
				data: {
					"Month": $scope.nexmonth,
					"Year": $scope.nextyear,
					"SalesRepID": $cookies.getObject('UserID'),
					"CompanyID": 10
				}
			}).then(function (response) {
				//(response.data);
				$scope.nextplanstatus = response.data.Response.Status;
				//($scope.nextplanstatus) ; 
			});
		}

		$scope.GetNextMonthStatus();

		$scope.CreatePlan = function () {
			$http({
				method: "POST",
				url: BASE_URL + '/Visit/CreateVisitPlan',
				headers: {
					"Content-Type": "application/json",
					"Token": $cookies.getObject('SecurityToken'),
					"UserID": $cookies.getObject('UserID')
				},
				data: {
					UserName: $cookies.getObject('FullName'),
					PlanName: $scope.curmonth,
					Month: mm,
					Year: yy,
					CompanyID: 10
				}
			}).then(function (response) {
				if (response.data.IsSuccess) {
					window.location.reload();
				}
			})
		}

		$scope.planvisits = function () {
			$http({
				method: "POST",
				url: BASE_URL + "/Visit/GetPlanVisits",
				headers: {
					"Content-Type": "application/json",
					"Token": $cookies.getObject('SecurityToken'),
					"UserID": $cookies.getObject('UserID')
				},
				data: {
					"Month": mm,
					"Year": yy,
					"SalesRepID": $cookies.getObject('UserID'),
					"CompanyID": 10
				}
			}).then(function (response) {
				//(response.data);
				$scope.visits = response.data.Response.Visits;
				$scope.cancreate = response.data.Response.Status;
				var defaultEvents = [];
				for (var i = 0; i < $scope.visits.length; i++) {
					defaultEvents.push({
						title: $scope.visits[i].DoctorName,
						start: $scope.visits[i].VisitDate,
						className: 'bg-purple'
					})
				}
				setTimeout(function () {
					$scope.jq(defaultEvents);
				}, 2000);
				//(defaultEvents);
			});

		};

		$scope.planvisits();

		$scope.planvisit = function (x,y,z) {
			$http({
				method: "POST",
				url: BASE_URL + "/Visit/GetPlanVisits",
				headers: {
					"Content-Type": "application/json",
					"Token": $cookies.getObject('SecurityToken'),
					"UserID": $cookies.getObject('UserID')
				},
				data: {
					"Month": y,
					"Year": z,
					"SalesRepID": x,
					"CompanyID": 10
				}
			}).then(function (response) {
				//(response.data);
				$scope.visits = response.data.Response.Visits;
				$scope.cancreate = response.data.Response.Status;
				document.getElementById('LoadVisits').style.display = "none" ; 
				$scope.loadvisits = false ; 
				
			});

		};

		$scope.getalldata = function () {
			//	//("das") ; 
			//get all doctors
			$scope.docid = 0;
			$scope.docname = 0;
			$scope.orgid = 0;
			$scope.orgname = 0;
			$scope.vislevel = 0;
			$scope.vistype = 0;
			$scope.visdate = "";
			$scope.donevisit = false;
			$scope.sortdocs = undefined;
			$scope.Presscreate  = false ; 
			$http({
				method: "POST",
				url: BASE_URL + "/Doctor/GetDoctors",
				headers: {
					"Content-Type": "application/json",
					"Token": $cookies.getObject('SecurityToken'),
					UserID: $cookies.getObject('UserID'),
				},
				data: {
					"UserID": $cookies.getObject('UserID'),
					"RoleID": $cookies.getObject('RoleID'),
					"CompanyID": 10
				}
			}).then(function (response) {
					//(response.data);
					$scope.alldocs = response.data.Response;
				},
				function (response) {
					//("error from the server");
				});



			//get all orgs

			$scope.vislevels = [];
			$scope.vislevels.push({
				Name: "Single"
			});
			$scope.vislevels.push({
				Name: "Coaching"
			});
			$scope.vislevels.push({
				Name: "Managerial"
			});

			$scope.vistypes = [];
			$scope.vistypes.push({
				Name: "UnPlanned"
			});
			if ($scope.cancreate === "Created")
				$scope.vistypes.push({
					Name: "Planned"
				});
		};
		$scope.getorgs = function (x) {
			//(x);
			$http({
				method: "POST",
				url: BASE_URL + "/Doctor/GetDoctorOrgs",
				headers: {
					"Content-Type": "application/json",
					"Token": $cookies.getObject('SecurityToken'),
					UserID: $cookies.getObject('UserID'),
				},
				data: {
					DoctorID: x,
					"CompanyID": 10
				}
			}).then(function (response) {
					//(response.data);
					$scope.allorgs = response.data.Response;
				},
				function (response) {
					//("error from the server");
				});
		};

		$scope.createvisit = function () {
			$scope.Presscreate = true ; 
			
			$scope.visitdate = mm + "/" + $scope.visdate + "/" + yy;
			$http({
				method: "POST",
				url: BASE_URL + "/Visit/CreateVisit",
				headers: {
					"Content-Type": "application/json",
					"Token": $cookies.getObject('SecurityToken'),
					UserID: $cookies.getObject('UserID'),
				},
				data: {
					"UserID": $cookies.getObject('UserID'),
					"UserName": $cookies.getObject('FullName'),
					"DoctorID": $scope.docid,
					"DoctorName": $scope.docname,
					"OrgID": $scope.orgid,
					"OrgName": $scope.orgname,
					"VisitDate": $scope.visitdate,
					"Type": $scope.vistype,
					"VisitLevel": $scope.vislevel,
					"CompanyID": 10
				}

			}).then(function (response) {
					//(response.data);
					if (response.data.IsSuccess) {
						$scope.cleardata();
						$scope.donevisit = true;
						$scope.planvisits();
					}

				},
				function (response) {
					//("error from server");
				});
		};
		
		$scope.createvisitVirtual = function (DID,DN,OID,ON,VD,T,VL) {
			
			
			$http({
				method: "POST",
				url: BASE_URL + "/Visit/CreateVisit",
				headers: {
					"Content-Type": "application/json",
					"Token": $cookies.getObject('SecurityToken'),
					UserID: $cookies.getObject('UserID'),
				},
				data: {
					"UserID": $cookies.getObject('UserID'),
					"UserName": $cookies.getObject('FullName'),
					"DoctorID": DID,
					"DoctorName": DN,
					"OrgID": OID,
					"OrgName": ON,
					"VisitDate": VD,
					"Type": T,
					"VisitLevel": VL,
					"CompanyID": 10
				}

			}).then(function (response) {
					////(response.data);
				$scope.PressAdd = false  ; 
				$scope.errorM = response.data.ErrorMessage ; 
				if (response.data.IsSuccess) 
					$scope.SuccessM = true	;   
				else 
					$scope.SuccessM = false ; 
				
					$('#ErrorModal2').modal('show'); 
				},
				function (response) {
				//(response.data) ; 
					//("error from server");
				});
		};
		
		$scope.cleardata = function () {
			$scope.docid = undefined;
			$scope.docname = 0;
			$scope.orgid = undefined;
			$scope.orgname = 0;
			$scope.visdate = undefined;
			$scope.vislevel = 0;
			$scope.vistype = 0;
		};

		$scope.getdocdetails = function () {
			//($scope.docname);
			if ($scope.alldocs != undefined)
				if ($scope.alldocs.length !== 0) {
					// //("asd"); 
					for (var i = 0; i < $scope.alldocs.length; i++) {
						if ($scope.docname === $scope.alldocs[i].Name) {
							$scope.docid = $scope.alldocs[i].ID;
							$scope.getorgs($scope.docid);
							break;
						}

					}
				}
			//($scope.docname);
			//($scope.docid);
		};

		$scope.getorgdetails = function () {
			////($scope.allorgs) ;
			if ($scope.allorgs != undefined)
				if ($scope.allorgs.length != 0) {
					for (var i = 0; i < $scope.allorgs.length; i++) {
						if ($scope.orgname === $scope.allorgs[i].Name) {
							$scope.orgid = $scope.allorgs[i].ID;
							break;
						}
					}
				}

			//($scope.orgname);
			//($scope.orgid);
		};

		$scope.getvisitid = function (x) {
			$scope.visitid = x;
			//($scope.visitid);
		};

		$scope.redatevisit = function (x) {
			//(x);
			//($scope.visitid);
			if ($scope.cancreate !== 'Submitted') {

				$http({
					method: "POST",
					url: BASE_URL + "/Visit/ChangeVisitDate",
					headers: {
						"Content-Type": "Application/json",
						"Token": $cookies.getObject('SecurityToken'),
						"UserID": $cookies.getObject('UserID')
					},
					data: {
						VisitID: $scope.visitid,
						NewDate: x,
						CompanyID: 10
					}
				}).then(function (response) {
					//(response.data);
					$scope.planvisits();
				});
			} else {
				//("The Plan is Already Submitted");
			}
		};

		$scope.submitvisitplan = function () {
			$http({
				method: "POST",
				url: BASE_URL + "/Visit/SubmitVisitPlan",
				headers: {
					"Content-Type": "Application/json",
					"Token": $cookies.getObject('SecurityToken'),
					"UserID": $cookies.getObject('UserID')
				},
				data: {
					"CompanyID": 10
				}
			}).then(function (response) {
				//(response.data);
				$scope.errorM = response.data.ErrorMessage;
				if (response.data.IsSuccess)
					window.location.reload();
				else {
					$("#ErrorModal").modal("show");
				}

			})
		};

		$scope.getTeam = function () {

			$http({
				method: 'POST',
				url: BASE_URL + '/SalesRep/GetTeam',
				data: {
					"CompanyID": 10
				},
				headers: {
					"Content-Type": "Application/json",
					"Token": $cookies.getObject('SecurityToken'),
					"UserID": $cookies.getObject('UserID')
				}
			}).then(function (res) {
				//(res.data);
				$scope.team = res.data.Response;
				$scope.team.push({


					ActiveDate: "",
					ManagerID: "",
					ManagerName: "",
					Mobile: "",
					SalesRepID: $cookies.getObject('UserID'),
					SalesRepName: "Me",
					Status: ""
				}) ; 
				//($scope.team);
			});

		};
		
		$scope.getID = function(x){
			document.getElementById('mapDate').value = "" ; 
			//(x); 
			$scope.currentID = x; 
			if(x === $scope.ID)
			$scope.planvisits() ;
			else
				$scope.visits =[] ; 
		};
		
		$scope.ViewPlan = function (){
			$scope.loadvisits = true ; 
			$scope.PressAdd = false ; 
			$scope.mapDate = document.getElementById('mapDate').value ; 
			//($scope.mapDate) ; 
			$scope.month = $scope.mapDate.substring(0,2) ; 
			$scope.year = $scope.mapDate.substring(3,$scope.mapDate.length) ; 
			
			//($scope.month) ; 
			//($scope.year)  ; 			
			$scope.planvisit($scope.currentID , $scope.month , $scope.year) ; 
			
		} ; 
			
		if ($scope.role === 'SalesManager') {
			$scope.getTeam();
		} ; 

		
		$scope.getdeadline = function(){
			$http({
				method : "POST" , 
				url : BASE_URL + '/Visit/GetPlanDeadline',
				headers :{
					"content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID')
				} , 
				data : {
				"CompanyID":10
				}
			}).then(function(response){
			   $scope.deadline = response.data.Response.DeadlineDay ; 
			}) ; 
		}  ; 
		
		$scope.getdeadline() ;
		
		$scope.AddToVisitPlan = function(x) {
			$scope.PressAdd = true ; 
			for(var i = 0 ; i <$scope.visits.length ; i++){
				if($scope.visits[i].VisitID === x){
					$scope.Visitneeded = $scope.visits[i] ; 
					//($scope.visits[i]) ; 
					break ; 
				}
			}
			if($scope.Visitneeded.Level === 1)
				$scope.LEVEL = 'Single' ; 
			if($scope.Visitneeded.Level === 2)
				$scope.LEVEL = 'Coaching' ; 
			if($scope.Visitneeded.Level === 3)
				$scope.LEVEL = 'Managerial' ; 
			
			$scope.createvisitVirtual( $scope.Visitneeded.DoctorID , $scope.Visitneeded.DoctorName , $scope.Visitneeded.OrgID , $scope.Visitneeded.Org , $scope.Visitneeded.VisitDate , 'Planned' , $scope.LEVEL) ; 
			
			////($scope.Visitneeded.VisitDate) ; 
		} ; 
		
		//control calender 
		$scope.jq = function (x) {

			////(x);
			! function ($) {
				"use strict";

				var CalendarApp = function () {
					this.$body = $("body")
					this.$modal = $('#event-modal'),
						this.$event = ('#external-events div.external-event'),
						this.$calendar = $('#calendar'),
						this.$saveCategoryBtn = $('.save-category'),
						this.$categoryForm = $('#add-category form'),
						this.$extEvents = $('#external-events'),
						this.$calendarObj = null
				};
				/* on drop */
				CalendarApp.prototype.onDrop = function (eventObj, date) {
						//("Test Lolo");
						var $this = this;
						// retrieve the dropped element's stored Event Object
						var originalEventObject = eventObj.data('eventObject');
						var $categoryClass = eventObj.attr('data-class');
						// we need to copy it, so that multiple events don't have a reference to the same object
						var copiedEventObject = $.extend({}, originalEventObject);
						// assign it the date that was reported
						copiedEventObject.start = date;
						$scope.redatevisit(date);
						if ($categoryClass)
							copiedEventObject['className'] = [$categoryClass];
						// render the event on the calendar
						$this.$calendar.fullCalendar('renderEvent', copiedEventObject, true);
						// is the "remove after drop" checkbox checked?
						if ($('#drop-remove').is(':checked')) {
							// if so, remove the element from the "Draggable Events" list
							eventObj.remove();
						}
					},
					/* on click on event */
					CalendarApp.prototype.onEventClick = function (calEvent, jsEvent, view) {
						//("Test Shosho");
						var $this = this;
						var form = $("<form></form>");
						form.append("<label>Change event name</label>");
						form.append("<div class='input-group'><input class='form-control' type=text value='" + calEvent.title + "' /><span class='input-group-btn'><button type='submit' class='btn btn-success waves-effect waves-light'><i class='fa fa-check'></i> Save</button></span></div>");
						$this.$modal.modal({
							backdrop: 'static'
						});
						$this.$modal.find('.delete-event').show().end().find('.save-event').hide().end().find('.modal-body').empty().prepend(form).end().find('.delete-event').unbind('click').click(function () {
							$this.$calendarObj.fullCalendar('removeEvents', function (ev) {
								return (ev._id === calEvent._id);
							});
							$this.$modal.modal('hide');
						});
						$this.$modal.find('form').on('submit', function () {
							calEvent.title = form.find("input[type=text]").val();
							$this.$calendarObj.fullCalendar('updateEvent', calEvent);
							$this.$modal.modal('hide');
							return false;
						});
					},
					/* on select */
					CalendarApp.prototype.onSelect = function (start, end, allDay) {
						var $this = this;
						$this.$modal.modal({
							backdrop: 'static'
						});
						var form = $("<form></form>");
						form.append("<div class='row'></div>");
						form.find(".row")
							.append("<div class='col-md-6'><div class='form-group'><label class='control-label'>Event Name</label><input class='form-control' placeholder='Insert Event Name' type='text' name='title'/></div></div>")
							.append("<div class='col-md-6'><div class='form-group'><label class='control-label'>Category</label><select class='form-control' name='category'></select></div></div>")
							.find("select[name='category']")
							.append("<option value='bg-danger'>Danger</option>")
							.append("<option value='bg-success'>Success</option>")
							.append("<option value='bg-purple'>Purple</option>")
							.append("<option value='bg-primary'>Primary</option>")
							.append("<option value='bg-pink'>Pink</option>")
							.append("<option value='bg-info'>Info</option>")
							.append("<option value='bg-warning'>Warning</option></div></div>");
						$this.$modal.find('.delete-event').hide().end().find('.save-event').show().end().find('.modal-body').empty().prepend(form).end().find('.save-event').unbind('click').click(function () {
							form.submit();
						});
						$this.$modal.find('form').on('submit', function () {
							var title = form.find("input[name='title']").val();
							var beginning = form.find("input[name='beginning']").val();
							var ending = form.find("input[name='ending']").val();
							var categoryClass = form.find("select[name='category'] option:checked").val();
							if (title !== null && title.length !== 0) {
								$this.$calendarObj.fullCalendar('renderEvent', {
									title: title,
									start: start,
									end: end,
									allDay: false,
									className: categoryClass
								}, true);
								$this.$modal.modal('hide');
							} else {
								//('You have to give a title to your event');
							}
							return false;

						});
						$this.$calendarObj.fullCalendar('unselect');
					},
					CalendarApp.prototype.enableDrag = function () {
						////("Test Canta Clause");
						//init events
						//debugger;
						//($(this.$event));
						$(this.$event).each(function () {
							// create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
							// it doesn't need to have a start or end
							////("Test SoSo");
							var eventObject = {
								title: $.trim($(this).text()) // use the element's text as the event title
							};
							// store the Event Object in the DOM element so we can get to it later
							$(this).data('eventObject', eventObject);
							// make the event draggable using jQuery UI
							$(this).draggable({
								zIndex: 999,
								revert: true, // will cause the event to go back to its
								revertDuration: 0 //  original position after the drag
							});
						});
					},
					/* Initializing */
					CalendarApp.prototype.init = function () {

						////("el calender gahza ");
						this.enableDrag();
						/*  Initialize the calendar  */
						var date = new Date();
						var d = date.getDate();
						var m = date.getMonth();
						var y = date.getFullYear();
						var form = '';
						var today = new Date($.now());

						var $this = this;
						$this.$calendarObj = $this.$calendar.fullCalendar({
							slotDuration: '00:15:00',
							/* If we want to split day time each 15minutes */
							minTime: '08:00:00',
							maxTime: '19:00:00',
							defaultView: 'month',
							handleWindowResize: true,
							height: $(window).height() - 200,
							header: {
								left: '',
								center: 'title',
								right: ''
							},
							events: x,
							editable: true,
							droppable: true, // this allows things to be dropped onto the calendar !!!
							eventLimit: true, // allow "more" link when too many events
							selectable: true,
							drop: function (date) {
								$this.onDrop($(this), date);
							},
							select: function (start, end, allDay) {
								$this.onSelect(start, end, allDay);
							},
							eventClick: function (calEvent, jsEvent, view) {
								$this.onEventClick(calEvent, jsEvent, view);
							}

						});

						//on new event
						this.$saveCategoryBtn.on('click', function () {
							var categoryName = $this.$categoryForm.find("input[name='category-name']").val();
							var categoryColor = $this.$categoryForm.find("select[name='category-color']").val();
							if (categoryName != undefined)
								if (categoryName !== null && categoryName.length !== 0) {
									$this.$extEvents.append('<div class="external-event bg-' + categoryColor + '" data-class="bg-' + categoryColor + '" style="position: relative;"><i class="fa fa-move"></i>' + categoryName + '</div>')
									$this.enableDrag();
								}

						});
					},

					//init CalendarApp
					$.CalendarApp = new CalendarApp, $.CalendarApp.Constructor = CalendarApp

			}(window.jQuery),

			//initializing CalendarApp
			function ($) {
				"use strict";
				$.CalendarApp.init()
			}(window.jQuery);

		};
			
	}
})();

(function () {
	'use strict';

	angular.module('app').controller('VisitPlanCreateCtrl', VisitPlanCreateCtrl);

	VisitPlanCreateCtrl.$inject = ['$scope', '$rootScope', '$state', '$http', 'BASE_URL', '$cookies'];

	function VisitPlanCreateCtrl($scope, $rootScope, $state, $http, BASE_URL, $cookies) {
		////("vis create");
		$scope.previousmonths = [];
		var today = new Date();
		var mm = today.getMonth() + 1; //January is 0!
		var yy = today.getFullYear();
		//(yy);
		//(mm);
		if ((mm + 1) === 1) {
			$scope.previousmonths.push({
				Month: 12,
				Year: (yy - 1),
				ID: 1
			});
			$scope.previousmonths.push({
				Month: 11,
				Year: (yy - 1),
				ID: 2
			});
			$scope.previousmonths.push({
				Month: (10),
				Year: (yy - 1),
				ID: 3
			});

		} else if ((mm + 1) === 2) {
			$scope.previousmonths.push({
				Month: (mm),
				Year: yy,
				ID: 1
			});
			$scope.previousmonths.push({
				Month: (12),
				Year: yy - 1,
				ID: 2
			});
			$scope.previousmonths.push({
				Month: (11),
				Year: yy - 1,
				ID: 3
			});
		} else if ((mm + 1) === 3) {
			$scope.previousmonths.push({
				Month: (mm),
				Year: yy,
				ID: 1
			});
			$scope.previousmonths.push({
				Month: (mm - 1),
				Year: yy,
				ID: 2
			});
			$scope.previousmonths.push({
				Month: (12),
				Year: yy - 1,
				ID: 3
			});
		} else {
			$scope.previousmonths.push({
				Month: mm,
				Year: (yy),
				ID: 1
			});
			$scope.previousmonths.push({
				Month: (mm - 1),
				Year: (yy),
				ID: 2
			});
			$scope.previousmonths.push({
				Month: (mm - 2),
				Year: (yy),
				ID: 3
			});

		}
		if (mm === 12) {
			mm = 1;
			yy++;
		} else {
			mm++;
		}
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		for (var i = 0; i < monthNames.length; i++) {
			if (i === (mm - 1)) {
				$scope.curmonth = monthNames[i];
				$scope.curyear = yy;
				break;
			}
		}
		for (var i = 0; i < $scope.previousmonths.length; i++) {
			if (($scope.previousmonths[i].Month - 1) === i) {
				$scope.previousmonths[i].Month = monthNames[i];
			}
		}
		//($scope.curmonth) ; 
		//($scope.curyear) ; 

		$scope.getalldata = function () {

			$("#add-visit").modal("show");
			$scope.docid = 0;
			$scope.docname = 0;
			$scope.orgid = 0;
			$scope.orgname = 0;
			$scope.vislevel = 0;
			$scope.vistype = 0;
			$scope.donevisit = false;
			$scope.sortdocs = undefined;
			$scope.Presscreate  = false ; 

			$http({
				method: "POST",
				url: BASE_URL + "/Doctor/GetDoctors",
				headers: {
					"Content-Type": "application/json",
					"Token": $cookies.getObject('SecurityToken'),
					UserID: $cookies.getObject('UserID'),
				},
				data: {
					"UserID": $cookies.getObject('UserID'),
					"RoleID": $cookies.getObject('RoleID'),
					"CompanyID": 10
				}
			}).then(function (response) {
					//(response.data);
					$scope.alldocs = response.data.Response;
				},
				function (response) {
					//("error from the server");
				});
			$scope.vislevels = [];
			$scope.vislevels.push({
				Name: "Single"
			});
			$scope.vislevels.push({
				Name: "Coaching"
			});
			$scope.vislevels.push({
				Name: "Managerial"
			});
			$scope.vistypes = [];
			$scope.vistypes.push({
				Name: "UnPlanned"
			});
			$scope.vistypes.push({
				Name: "Planned"
			});
		};

		$scope.planvisits = function () {
			//(mm);
			//(yy);
			$http({
				method: "POST",
				url: BASE_URL + "/Visit/GetPlanVisits",
				headers: {
					"Content-Type": "application/json",
					"Token": $cookies.getObject('SecurityToken'),
					"UserID": $cookies.getObject('UserID')
				},
				data: {
					"Month": mm,
					"Year": yy,
					"SalesRepID": $cookies.getObject('UserID'),
					"CompanyID": 10
				}
			}).then(function (response) {
				//(response.data);
				$scope.visits = response.data.Response.Visits;
				$scope.cancreate = response.data.Response.Status;
				//($scope.cancreate);

			});

		};

		$scope.planvisits();


		$scope.CreatePlan = function () {

			for (var i = 0; i < $scope.previousmonths.length; i++) {
				if ($scope.plandate === $scope.previousmonths[i].ID) {
					$scope.Month = $scope.previousmonths[i].Month;
					$scope.Year = $scope.previousmonths[i].Year;
					break;
				}
			}


			$("#CreatePlan").modal("show");
			if ($scope.plandate === 0) {

				$http({
					method: "POST",
					url: BASE_URL + "/Visit/CreateVisitPlan",
					headers: {
						"Content-Type": "application/json",
						"Token": $cookies.getObject('SecurityToken'),
						"UserID": $cookies.getObject('UserID')
					},
					data: {
						UserName: $cookies.getObject('FullName'),
						PlanName: $scope.curmonth,
						Month: mm,
						Year: yy,
						CompanyID: 10
					}
				}).then(function (response) {
					if (response.data.IsSuccess) {
						window.location.reload();
					}
				});
			} else {
				$http({
					method: "POST",
					url: BASE_URL + "/Visit/CopyMonthVisitPlan",
					headers: {
						"content-type": "Application/json",
						"Token": $cookies.getObject('SecurityToken'),
						"UserID": $cookies.getObject('UserID')
					},
					data: {
						"UserName": $cookies.getObject('FullName'),
						"PlanName": $scope.curmonth,
						"Month": mm,
						"Year": yy,
						"CompanyID": 10
					}
				}).then(function (response) {
						//(response.data);
						$scope.planvisits();
						window.location.reload();
					},
					function (response) {
						//("Error from server");
					});
			}
		};

		$scope.createvisit = function () {
					$scope.Presscreate = true ; 

			$scope.visitdate = mm + "/" + $scope.visdate + "/" + yy;
			$http({
				method: "POST",
				url: BASE_URL + "/Visit/CreateVisit",
				headers: {
					"Content-Type": "application/json",
					"Token": $cookies.getObject('SecurityToken'),
					UserID: $cookies.getObject('UserID'),
				},
				data: {
					"UserID": $cookies.getObject('UserID'),
					"UserName": $cookies.getObject('FullName'),
					"DoctorID": $scope.docid,
					"DoctorName": $scope.docname,
					"OrgID": $scope.orgid,
					"OrgName": $scope.orgname,
					"VisitDate": $scope.visitdate,
					"Type": $scope.vistype,
					"VisitLevel": $scope.vislevel,
					"CompanyID": 10
				}

			}).then(function (response) {
					//(response.data);
					if (response.data.IsSuccess) {
						$scope.cleardata();
						$scope.donevisit = true;
						$scope.planvisits();
					}

				},
				function (response) {
					//("error from server");
				});
		};
		$scope.cleardata = function () {
			$scope.docid = undefined;
			$scope.docname = 0;
			$scope.orgid = undefined;
			$scope.orgname = 0;
			$scope.visdate = undefined;
			$scope.vislevel = 0;
			$scope.vistype = 0;
		};

		$scope.getorgs = function (x) {
			//get all orgs
			$http({
				method: "POST",
				url: BASE_URL + "/Doctor/GetDoctorOrgs",
				headers: {
					"Content-Type": "application/json",
					"Token": $cookies.getObject('SecurityToken'),
					UserID: $cookies.getObject('UserID'),
				},
				data: {
					"DoctorID": x,
					"CompanyID": 10
				}
			}).then(function (response) {
					//(response.data);
					$scope.allorgs = response.data.Response;
				},
				function (response) {
					//("error from the server");
				});
		};

		$scope.getdocdetails = function () {
			if ($scope.alldocs != undefined) {
				for (var i = 0; i < $scope.alldocs.length; i++) {
					if ($scope.docname === $scope.alldocs[i].Name) {
						$scope.docid = $scope.alldocs[i].ID;
						$scope.getorgs($scope.docid);
						break;
					}
				}
			}

			//($scope.docname);
			//($scope.docid);
		};

		$scope.getorgdetails = function () {
			if ($scope.allorgs != undefined) {
				for (var i = 0; i < $scope.allorgs.length; i++) {
					if ($scope.orgname === $scope.allorgs[i].Name) {
						$scope.orgid = $scope.allorgs[i].ID;
						break;
					}
				}
			}

			//($scope.orgname);
			//($scope.orgid);
		};

		$scope.submitvisitplan = function () {
			$http({
				method: "POST",
				url: BASE_URL + "/Visit/SubmitVisitPlan",
				headers: {
					"Content-Type": "Application/json",
					"Token": $cookies.getObject('SecurityToken'),
					"UserID": $cookies.getObject('UserID')
				},
				data: {
					"CompanyID": 10
				}
			}).then(function (response) {
				//(response.data);
				$scope.submitted = response.data.IsSuccess;
				if ($scope.submitted)
					$state.go("VisitPlan");
				else {
					$scope.errorM = response.data.ErrorMessage;
					$("#ErrorModal").modal("show");
				}
			})
		};
		
		$scope.getdeadline = function(){
			$http({
				method : "POST" , 
				url : BASE_URL + '/Visit/GetPlanDeadline',
				headers :{
					"content-type": "Application/json",
                    "Token": $cookies.getObject('SecurityToken'),
                    "UserID": $cookies.getObject('UserID')
				} , 
				data : {
				"CompanyID":10
				}
			}).then(function(response){
			   $scope.deadline = response.data.Response.DeadlineDay ; 
			}) ; 
		} ; 
		
		$scope.getdeadline() ;
		

	}
})();

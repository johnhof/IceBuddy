simpleApp.controller('TeamsCtrl', ['$scope', '$routeParams', 'Utils', 'Session', 'Api', function ($scope, $routeParams, Utils, Session, Api) {

  // expose services and modules
  $scope.session  = Session;

  // Model init and form submission
  $scope.teams  = [{
    title : 'joes shmoes'
  },{
    title : '1',
    seasons: [
      '11',
      '111',
    ],
    captains: [
      '1-1',
      '1-1-1',
    ],
    managers: [
      '1_1',
      '1_1_1',
    ]
  },{
    title : '2',
    seasons: [
      '',
      '',
    ],
    captains: [
      '',
      '',
    ],
    managers: [
      '',
      '',
    ]
  },{
    title : '3',
    seasons: [
      '',
      '',
    ],
    captains: [
      '',
      '',
    ],
    managers: [
      '',
      '',
    ]
  },{
    title : '4',
    seasons: [
      '',
      '',
    ],
    captains: [
      '',
      '',
    ],
    managers: [
      '',
      '',
    ]
  },{
    title : '5',
    seasons: [
      '',
      '',
    ],
    captains: [
      '',
      '',
    ],
    managers: [
      '',
      '',
    ]
  },{
    title : '6',
    seasons: [
      '',
      '',
    ],
    captains: [
      '',
      '',
    ],
    managers: [
      '',
      '',
    ]
  },]

}]);
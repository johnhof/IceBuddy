simpleApp.controller('HomeCtrl', ['$scope', 'Session', function ($scope, Session) {
  // Session.requireSignIn();


  $scope.teams = [{
    logo   : null,
    name   : 'Mighty Ducks',
    roster : ['foo', 'bar', 'lorem'],
    href   : '/teams/someId'
  }, {
    logo   : null,
    name   : 'The Flying D',
    roster : [],
    href   : '/teams/someId'
  }, {
    logo   : null,
    name   : 'Pittsburgh Penguins',
    roster : ['Sydney Crosby', 'evgeni malkin', 'Mark-Andre Fleury'],
    href   : '/teams/someId'
  }, {
    logo   : null,
    name   : 'Team Finland',
    roster : ['bar', 'lorem', 'ipsum'],
    href   : '/teams/someId'
  }, {
    logo   : null,
    name   : 'Puck Buddies',
    roster : ['John hofrichter', 'Duane Garber', 'Zach Zabetakis'],
    href   : '/teams/someId'
  }];

  $scope.players = [{
    avatar : null,
    name   : 'Sidney Crosby',
    number : '87',
    teams  : ['Pittsburgh Penguins'],
    href   : '/players/someId'
  }, {
    avatar : null,
    name   : 'Johnny Hockey',
    number : '13',
    teams  : [],
    href   : '/players/someId'
  }, {
    avatar : null,
    name   : 'Johnathan Teows',
    number : '19',
    teams  : ['Chicago Blackhawks', 'Team Teows'],
    href   : '/players/someId'
  }, {
    avatar : null,
    name   : 'Wayne Gretzky',
    number : '99',
    teams  : ['Edmontom Oilers', 'All Stars', 'LA Kings', 'St. Louis Blues'],
    href   : '/players/someId'
  }, {
    avatar : null,
    name   : 'Bobby Orr',
    number : '27',
    teams  : ['Boston Bruins', 'All Stars'],
    href   : '/players/someId'
  },];

  $scope.session = Session;

  $scope.inputs = {};
}]);
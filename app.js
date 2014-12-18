'use strict';

angular.module('app', [
  'ngRoute',
  'ngSanitize',
  'mgcrea.ngStrap'
])
.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  })
  .when('/browser', {
    templateUrl: 'browser/browser.html',
    controller: 'BrowserCtrl'
  })
  .when('/users', {
    templateUrl: 'users/users.html',
    controller: 'UsersCtrl'
  })
  .when('/beliefs', {
    templateUrl: 'beliefs/beliefs.html',
    controller: 'BeliefsCtrl'
  })
  .otherwise({redirectTo: '/'});

  $locationProvider.html5Mode(true);

}])

.controller('AppCtrl', function ($scope, $rootScope, $location, $http) {
  $rootScope.location = $location;

  $http.get('data/entries.json').
  success(function(data, status) {
    $scope.entries = data;
  })


})

'use strict';

angular.module('app', [
  'ngRoute',
  'ngSanitize',
  'mgcrea.ngStrap'
])
.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  /*$routeProvider
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
  .otherwise({redirectTo: '/'});
*/
  //$locationProvider.html5Mode(true);

}])

.controller('AppCtrl', function ($scope, $rootScope, $location, $http) {
  $rootScope.location = $location;

  $http.get('data/entries.json').
  success(function(data, status) {
    $scope.entries = data;

    $http.get('data/keywords.json').
    success(function(keywords, status) {

      $scope.keywords = keywords;

      var criterias = {
        count: function(d){ d.percentage = d.count / maxCount * 100; },
        entries: function(d){ d.percentage = d.entries.length / maxEntries * 100; }
      }

      $scope.criteria = 'count';

      var maxCount = d3.max(keywords, function(d){ return d.count; })
      var maxEntries = d3.max(keywords, function(d){ return d.entries.length; })

      $scope.$watch('criteria', function(criteria){
        $scope.keywords
        .forEach(criterias[criteria])
      })

    })

    $http.get('data/concepts.json').
    success(function(concepts, status) {

      $scope.concepts = concepts;

      var maxCount = d3.max(concepts, function(d){ return d.count; })

      $scope.concepts
      .forEach(function(d){
        d.percentage = d.count / maxCount * 100;
      })

      var $section = $('#keywords-focal');
      $("#keywords-network").panzoom({
        $zoomIn: $section.find(".zoom-in"),
        $zoomOut: $section.find(".zoom-out"),
      });

      $section = $('#concepts-focal');
      $("#concepts-network").panzoom({
        $zoomIn: $section.find(".zoom-in"),
        $zoomOut: $section.find(".zoom-out"),
      });

      $section = $('#focal');
      $("#network").panzoom({
        $zoomIn: $section.find(".zoom-in"),
        $zoomOut: $section.find(".zoom-out"),
      });

    })


  })


})

angular.module('app')
.controller('MainCtrl', function ($scope, $http) {

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
    //$("#network").imageLens({ lensSize: 250 });


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




  //  $("#alluvial").imageLens({ lensSize: 250 });

  //  $("#concepts-network").imageLens({ lensSize: 250 });
  //  $("#keywords-network").imageLens({ lensSize: 250 });


  })




});

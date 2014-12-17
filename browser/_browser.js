angular.module('app')
.controller('BrowserCtrl', function ($scope, $http) {

  $http.get('data/keywords.json').
  success(function(data, status) {

    $scope.keywords = d3.entries(data).filter(function(d){ return d.value>10});

    $http.get('data/total_with_neighbors.json').
    success(function(data, status) {
      $scope.entries = data;

      $scope.entries.forEach(function(d){
        d.words = d.words.map(function(w){
          return w.key;
        })
        d.topic = d.topic.map(function(w){
          return w.word;
        })
      })


      $scope.filterWords = []

      $scope.filterEntries = function(a){
        return !$scope.filterWords.length
          || $scope.filterWords.every(function(e){
            return a.words.indexOf(e) != -1 //|| a.topic.indexOf(e) != -1;
          })
      }

      $scope.filterBySimilar = function(a){
        var similar = a.similar.map(function(d){ return d.id; });
        console.log($scope.entries.filter(function(d){
          return similar.indexOf(d.index) != -1;
        }))
      }

      $scope.addKeyword = function(keyword){
        if ($scope.filterWords.indexOf(keyword.key) != -1) return;
        $scope.filterWords.push(keyword.key)
      }

    })


  })


})

.directive('group', function () {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      scope.$watch(attrs.watch, function (watch){
        var last = element;
        element.children().each(function(i, o){
          if( (i) && (i) % attrs.every == 0) {
            var oldLast = last;
            last = element.clone().empty();
            last.insertAfter(oldLast);
          }
          $(o).appendTo(last)
        })

      },true)

    }
  };
})

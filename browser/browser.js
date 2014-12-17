angular.module('app')
.controller('BrowserCtrl', function ($scope, $http) {

  $http.get('data/keywords.json').
  success(function(keywords, status) {

    $scope.keywords = keywords;

    $scope.filterKeywords = []
    $scope.similar = []
    $scope.similarEntry = null;
    $scope.search = {belief:''}

    $scope.filterEntries = function(a){
      return !$scope.filterKeywords.length
      || $scope.filterKeywords.every(function(e){
        return a.keywords.indexOf(e) != -1;
      })
    }

    $scope.filterSimilar = function(entry){
      return !$scope.similar.length || $scope.similar.indexOf(entry.index) != -1;
    }

    $scope.filterAll = function(entry){
      return $scope.filterSimilar(entry) && $scope.filterEntries(entry) && entry.belief.toLowerCase().search($scope.search.belief) != -1;
    }

    function update(){
      if (!$scope.keywords || !$scope.entries) return;
      var ks = []
      $scope.entries.filter($scope.filterAll).forEach(function(d){
        ks = ks.concat(d.keywords);
      })

      $scope.keywords.forEach(function(d){
        d.selected = $scope.filterKeywords.indexOf(d.key) != -1
        d.muted = ks.indexOf(d.key) == -1;
      })
    }

    $scope.$watch('search.belief', update)

    $scope.removeSimilar = function(){
      $scope.similar = [];
      $scope.similarEntry = null;
      update();
    }

    $scope.addSimilar = function(entry){
      $scope.similar = entry.similar;
      $scope.similarEntry = entry;
      update();
    }

    $scope.removeKeyword = function(keyword){
      $scope.filterKeywords.splice($scope.filterKeywords.indexOf(keyword),1)
      update();
    }

    $scope.addKeyword = function(keyword){

      if (keyword.muted) return;

      if ($scope.filterKeywords.indexOf(keyword.key) != -1)
        $scope.filterKeywords.splice($scope.filterKeywords.indexOf(keyword.key),1)
      else
        $scope.filterKeywords.push(keyword.key);

      update();

    }

    $scope.$watch('entries',function(){
      $('[data-toggle="tooltip"]').tooltip();
    })



  })


})

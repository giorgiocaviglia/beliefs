angular.module('app')
.controller('UsersCtrl', function ($scope, $http) {

  $http.get('data/entries.json').
  success(function(data, status) {
    $scope.entries = data;
  })

  $scope.$watch('entries', function(entries){
    if (!entries) return;

    $http.get('data/groups.json').
    success(function(groups, status) {

      console.log(groups)

      $scope.user = null;
      $scope.similar = [];

      $scope.setSimilar = function(user){
        $scope.similar = groups.filter(function(d){ return d.id == user; })[0].similar;

      }

      $scope.filterUser = function(user){
        return !$scope.similar.length || $scope.similar.indexOf(user.key) != -1;
      }

      var nest = d3.nest()
      .key(function(d){ return d.user; })
      .rollup(function(d){

        var singleKeywords = []
        var keywords = d.map(function(k){ return k.keywords; })
        keywords.forEach(function(d){
          singleKeywords = unique(singleKeywords.concat(d))
        })

        var singleConcepts = []
        var concepts = d.map(function(k){ return k.concepts; })
        concepts.forEach(function(d){
          singleConcepts = unique(singleConcepts.concat(d))
        })

        return {
          keywords: singleKeywords,
          concepts: singleConcepts
      }})
      .entries(entries)

      $scope.users = nest;
    })

    function unique(array) {
      var a = array.concat();
      for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
          if(a[i] === a[j])
            a.splice(j--, 1);
          }
        }

        return a;
      };

      var array1 = ["Vijendra","Singh"];
      var array2 = ["Singh", "Shakya"];
      // Merges both arrays and gets unique items
      var array3 = unique(array1.concat(array2));

    })




});

angular.module('app')
.controller('BeliefsCtrl', function ($scope, $http) {
  console.log('diocane')
  $http.get('data/concepts_network.json').
  success(function(data, status) {

    //console.log(data)

    var nodes = [];

    data = data.filter(function(d){ return d.value > 4})

    data.forEach(function(d){
      if( nodes.indexOf(d.source) == -1 ) {
        nodes.push(d.source);
      }
      if( nodes.indexOf(d.target) == -1 ) {
        nodes.push(d.target);
      }
      d.source = nodes.indexOf(d.source);
      d.target = nodes.indexOf(d.target);
    })

    nodes = nodes.map(function(d){
      return { name:d, label: d.replace('_',''), group: 'concept'}//d.search('_') != -1 ? 'keyword' : 'concept' }
    })

    /*data = data.filter(function(d){
      return filterLinks.indexOf(nodes[d.source].label) != -1 || filterLinks.indexOf(nodes[d.target].label) != -1
    })*/

    $scope.data = {
      links: data,
      nodes: nodes
    }
  })


  /*$http.get('data/beliefs-nodes.csv').
  success(function(entries, status) {

    $scope.entries = d3.csv.parse(entries);

    $http.get('data/beliefs-links.csv').
    success(function(data, status) {

      var data = d3.csv.parse(data);

      var nodes = [];
      data = data.filter(function(d){ return d.value >=.97 })

      data.forEach(function(d){
        if( nodes.indexOf(d.source) == -1 ) {
          nodes.push(d.source);
        }
        if( nodes.indexOf(d.target) == -1 ) {
          nodes.push(d.target);
        }
        d.source = nodes.indexOf(d.source);
        d.target = nodes.indexOf(d.target);
      })

      nodes = nodes.map(function(d){
        return { name:d, label: $scope.entries[d] ? $scope.entries[d].belief.slice(0,80) : d, group: $scope.entries[d] ? $scope.entries[d].topic : null }
      })

      var graph = {
        nodes: nodes,
        links : data
      }

      $scope.data = graph;

    }).
    error(function(error, status) {
      console.log('error:', error)
    });

  })
  .error(function(error, status) {
    console.log('error:', error)
  });*/

});

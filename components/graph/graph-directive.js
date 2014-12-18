angular.module('app')
.directive('graph', function () {

  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {

      var graph = d3.graph()
      , selection = d3.select(element[0]);

      function update(){
        if (!scope.data) return;

        graph
        .width(2000)
        .height(2000)
    //    .showLabels(scope.showLabels)
        .on("update", function(){
          scope.color = graph.color().range().map(function(d,i){
              return { name: graph.color().domain()[i], value: d }
          });
        })
        .on("click", function(d){
          console.log(d)
          scope.list.push(d);
          scope.$apply();
        })

        selection
        .datum(scope.data)
        .call(graph)



      }

      scope.$watch('data', update);
      scope.$watch('showLabels', update);

    }
  }
})

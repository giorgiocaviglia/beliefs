!function(){

  d3.graph = function(){

    var width,
    height,
    svg,
    dispatch = d3.dispatch("update"),
    x,y,zoom,
    color, area,
    showLabels = true;

    function graph(selection){
      selection.each(function(data){

        var graph = data;

        color = d3.scale.category20();

        area = d3.scale.linear()
        .range([5,20])

        // x scale
        x = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);

        // y scale
        y = d3.scale.linear()
        .domain([0, height])
        .range([height, 0]);

        // zoom
        zoom = d3.behavior.zoom()
        .x(x)
        .y(y)
        .on("zoom", tick);

        var force = d3.layout.force()
        .charge(charge)
        .linkDistance(120)
        .size([width, height]);

        if (!svg) svg = selection.append("svg")
          .attr("width", width)
          .attr("height", height)
          .call(zoom)

          // overlay for zoom
          overlay = svg.append("rect")
          .attr("class","overlay")
          .classed("active", false)
          .attr("width", width)
          .attr("height", height)
          .attr("fill-opacity", 0);

          force
          .nodes(graph.nodes)
          .links(graph.links)
          .start();

          var link = svg.selectAll(".link")
          .data(graph.links)
          .enter().append("line")
          .attr("class", "link")
          .style("stroke-width", function(d) { return Math.sqrt(d.value); });

          var node = svg.selectAll(".node")
          .data(graph.nodes.filter(function(d){ return d.weight > 0}))
          .enter().append("g")
          .attr("class", "node")
          //  .style("display", function(d){ return d.weight > 2 ? '':'none'})
          //  .call(force.drag);

          node.append("circle")
          .attr("r", 5)
          .style("fill", function(d) { return d.group === null ? '#eee' : color(d.group); })

          node.append("title")
          .text(function(d) { return d.name; });

          if (showLabels)
            node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.label });

          force.on("tick", tick);



          function tick(){
            link.attr("x1", function(d) { return x(d.source.x); })
            .attr("y1", function(d) { return y(d.source.y); })
            .attr("x2", function(d) { return x(d.target.x); })
            .attr("y2", function(d) { return y(d.target.y); });

            //node
            //.attr("transform", function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
            node.attr("transform", function(d) {
              return 'translate(' + x(d.x) + ',' + y(d.y) + ')';
            })
          }

          dispatch.update();

        })
      }

      function radius(d){
        return Math.sqrt(area(d.weight) / Math.PI);
      }

      function charge(d){
        return -radius(d) * radius(d);
      }

      graph.width = function(_){
        if (!arguments.length) return width;
        width = _;
        return graph;
      }

      graph.height = function(_){
        if (!arguments.length) return height;
        height = _;
        return graph;
      }

      graph.color = function(_){
        if (!arguments.length) return color;
        color = _;
        return graph;
      }

      graph.showLabels = function(_){
        if (!arguments.length) return showLabels;
        showLabels = _;
        return graph;
      }

      d3.rebind(graph,dispatch,"on");

      return graph;
    }



  }();

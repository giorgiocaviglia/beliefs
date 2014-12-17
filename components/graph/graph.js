!function(){

  d3.graph = function(){

    var width,
    height,
    svg,
    dispatch = d3.dispatch("update","click"),
    x,y,zoom,
    color, area,
    node, link,
    anchorNode, anchorLink,
    showLabels = true;

    function graph(selection){
      selection.each(function(data){

        var graph = data;

        console.log(graph)

        color = d3.scale.category20();

        area = d3.scale.linear()
        .range([2,15])

        var strength = d3.scale.linear()
        .domain(d3.extent(graph.links, function(d){return d.value;}))
        .range([1,10])

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
        .on("zoom", redraw);

        var w = width, h = height;

        var labelDistance = 0;

        if (!svg) init(selection);

        var vis = svg;

        var nodes = [];
        var labelAnchors = [];
        var labelAnchorLinks = [];
        var links = [];

        graph.nodes.forEach(function(d,i){
          nodes.push(d);
          //var node = { label: d.label}
          labelAnchors.push({
            node : nodes[i]
          });
          labelAnchors.push({
            node : nodes[i]
          });
        })


        /*for(var i = 0; i < 30; i++) {
          var node = {
            label : "node " + i
          };
          nodes.push(node);

        };*/


        graph.links.forEach(function(d,i){
          d.weight = +d.value;
          links.push(d);
          //console.log(labelAnchors[d.target * 2 +1])

        })

        nodes.forEach(function(d,i){
          if (d.fixed) console.log(d)
          labelAnchorLinks.push({
            source : i * 2,
            target : i * 2 + 1,
            weight : 1
          });
        })



        /*for(var i = 0; i < nodes.length; i++) {
          for(var j = 0; j < i; j++) {
            if(Math.random() > .95)
              links.push({
                source : i,
                target : j,
                weight : Math.random()
              });
            }
            labelAnchorLinks.push({
              source : i * 2,
              target : i * 2 + 1,
              weight : 1
            });
          };*/

          var force = d3.layout.force()
            .size([w, h])
            .nodes(nodes)
            .links(links)
            .gravity(1).linkDistance(100).charge(-3000)
           .linkStrength(function(x) {
            return strength(x.value)*2;
          });


          force.start();

          var force2 = d3.layout.force().nodes(labelAnchors).links(labelAnchorLinks).gravity(0).linkDistance(0).linkStrength(8).charge(-100).size([w, h]);
          force2.start();

          // nodes
          link = link.data(links)
          // update nodes
          // add new nodes
          link.enter()
          .append('line')
          .attr("class","link")
          .style("stroke", "#999")
          .style("stroke-opacity", ".2")
          .style("stroke-width", function(d){ return strength(d.value) +"px"; })
          // remove old nodes
          link.exit().remove();

          // nodes
          node = node.data(nodes.filter(function(d){ return d.weight > 0}), function(d){ return d.index; })
          // update nodes
          node.selectAll(".point")
          .attr("r", radius)
          .style("fill", function(d){ return d.group == 'keyword' ? '#f00' : '#0f0'})
          // add new nodes
          node.enter()
          .append('g')
          .attr("class","node")
          .append("circle")
          .attr("class","point")
          .attr("r", radius)
          .style("fill", function(d){ return d.group == 'keyword' ? '#66f288' : '#009eff'})
          // remove old nodes
          node.exit().remove();


        //  node.append("svg:circle").attr("r", 5).style("fill", "#555").style("stroke", "#FFF").style("stroke-width", 2);
          //node.call(force.drag);
        svg.selectAll("line.anchorLink").remove()
        anchorLink = svg.selectAll("line.anchorLink")
        .data(labelAnchorLinks)
        .enter().append("svg:line")
        .attr("class", "anchorLink")
        //.style("stroke", "#999");

        /*anchorLink.enter()
        .append('line')
        .attr("class","anchorLink")
        // remove old nodes
        anchorLink.exit().remove();
        */
        // nodes
        svg.selectAll(".anchorNode").remove()

        anchorNode = svg.selectAll("g.anchorNode")
          .data(force2.nodes().filter(function(d){ return d.node.weight > 0}))
          .enter().append('g')
          .attr("class","anchorNode")

        anchorNode.append("svg:text")
          .text(function(d, i) {
            return i % 2 == 0 ? "" : d.node.label
          })
          .on('click',function(d){
            dispatch.click(d.node.label)
            d.node.fixed = true;
          })
          .style("font-family", "Roboto")
          .style("font-size", 12);
        /* update nodes
        anchorNode
        .selectAll("text")
        .text(function(d, i) {
          return i % 2 == 0 ? "" : d.node.label
        })
        .on('click',function(d){
          dispatch.click(d.node.label)
        })
        .style("font-family", "Arial")
        .style("font-size", 12)

        anchorNode.enter()
        .append('g')
        .attr("class","anchorNode")
        .append("svg:text")
        .text(function(d, i) {
          return i % 2 == 0 ? "" : d.node.label
        })
        .on('click',function(d){
          dispatch.click(d.node.label)
        })
        .style("font-family", "Arial")
        .style("font-size", 12);

        // remove old nodes
        anchorNode.exit().remove();*/




        //anchorLink = vis.selectAll("line.anchorLink").data(labelAnchorLinks)//.enter().append("svg:line").attr("class", "anchorLink").style("stroke", "#999");
/*
        anchorNode = vis.selectAll("g.anchorNode").data(force2.nodes().filter(function(d){ return d.node.weight > 0; })).enter().append("svg:g").attr("class", "anchorNode");
          anchorNode.append("svg:circle").attr("r", 0)//.style("fill", "#FFF");
          anchorNode.append("svg:text").text(function(d, i) {
            return i % 2 == 0 ? "" : d.node.label
          })
          .on('click',function(d){
            dispatch.click(d.node.label)
          }).style("fill", "#555").style("font-family", "Arial").style("font-size", 14);
          */
        var updateLink = function() {
          this.attr("x1", function(d) {
            return x(d.source.x);
          }).attr("y1", function(d) {
            return y(d.source.y);
          }).attr("x2", function(d) {
            return x(d.target.x);
          }).attr("y2", function(d) {
            return y(d.target.y);
          });

        }

        var updateNode = function() {
          this.attr("transform", function(d) {
            return "translate(" + x(d.x) + "," + y(d.y) + ")";
          });

        }

        force.on("tick", tick);

          function redraw(){
            node.call(updateNode);
            anchorNode.call(updateNode);
            link.call(updateLink);
            anchorLink.call(updateLink);
          }



          function tick(){

            force2.start();

            node.call(updateNode);

            anchorNode.each(function(d, i) {
              if(i % 2 == 0) {
                d.x = d.node.x;
                d.y = d.node.y;
              } else {
                var b = this.childNodes[0].getBBox();
                var diffX = d.x - d.node.x;
                var diffY = d.y - d.node.y;

                var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                var shiftX = b.width * (diffX - dist) / (dist * 2);
                shiftX = Math.max(-b.width, Math.min(0, shiftX));
                var shiftY = 5;

                this.childNodes[0].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
              }
            });



            anchorNode.call(updateNode);
            link.call(updateLink);
            anchorLink.call(updateLink);

          }



        })
      }

      function init(selection){
        svg = selection.append("svg")
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

        // nodes
        link = svg.append("g")
        .selectAll(".link");

        node = svg.append("g")
        .selectAll(".node");


        /*
        // nodes
        anchorNode = svg.append("g")
        .selectAll(".anchorNode");

        anchorLink = svg.append("g")
        .selectAll(".anchorLink");
        */

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

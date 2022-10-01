function updateUoS(struct) {

  var margin = { top: 100, right: 110, bottom: -100, left: 120 },
    height = 600 - margin.right - margin.left,
    width = 300 - margin.top - margin.bottom,
    rectW = 70;
  rectH = 30;
  //bbox = NaN,
  maxTextLength = 0;

  var svg = d3
    .select("#content")
    .append("svg")
    .attr("width", 2000)
    .attr("height", 2000);


  stratify = d3
    .stratify()
    .id(function (d) {
      return d.child;
    })
    .parentId(function (d) {
      return d.parent;
    });

  var stratify = stratify(struct);
  var rootElement = d3.hierarchy(stratify);

  var radius = 1300;

  var tree = d3
    .tree()
    .size([2 * Math.PI, radius])
    .separation(function (a, b) {
      return a.parent == b.parent ? 20000 : 10;
    });

  var g = svg
    .append("g")
    .attr("id", "uos")
    .attr(
      "transform",
      "translate(" + (width + 100) + "," + (height + 90) + ")"
    );

  var root = tree(rootElement);

  var depth = 1;

  let filnodes = filterNodes();
  let fillinks = filterLinks();

  //updateUoS();



  var link = g
    .selectAll(".link")
    .data(fillinks)
    //.data(root.links())
    // .data(root.links().filter(function(d) { return d.source.depth <=1 }))
    .enter()
    .append("path")
    .attr("class", function (d) {
      return d.source.data.id
        .replace(/ /g, "")
        .replace("(", "")
        .replace(")", "")
        .toLowerCase();
    })
    .classed("link", true)
    .attr(
      "d",
      d3
        .linkRadial()
        .angle(function (d) {
          return d.x;
        })
        .radius(function (d) {
          return d.y;
        })
    )
    .style("opacity", function (d) {
      if (d.target.depth <= depth) return 1;
      else return 0;
    });

  //console.log(root.links());

  var node = g
    .selectAll(".node")
    .data(filnodes)
    // .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", function (d) {
      //   console.log(d);
      return d.child;
    })
    .attr("transform", function (d) {
      // if (d.depth > 1)
      //  return "translate(" + fullRadialPoint(d.x, d.y) + ")";
      // else
      return "translate(" + radialPoint(d.x, d.y) + ")";
    });

  node
    .append("circle")
    .attr("cx", function (d) {
      // console.log(radialPoint(d.x, d.y));
      return 0;
    })
    .attr("cy", function (d) {
      return 0;
    })
    .attr("r", 6)
    .attr("class", function (d) {
      return (
        "node" + (d.children ? " node--internal" : " node--leaf")
      );
    })
    .attr("id", function (d) {
      return d.data.data.child
        .replace(/ /g, "")
        .replace("(", "")
        .replace(")", "")
        .toLowerCase();
    })
    .style("fill", "red")
    // .style("opacity", 1)

    .style("opacity", function (d) {
      if (d.depth <= depth) return 1;
      else return 0;
    })

    .on("click", function (d) {
      var parentnode = this.parentNode.getAttribute("transform");

      var transCoords = parentnode
        .substring(
          parentnode.indexOf("(") + 1,
          parentnode.indexOf(")")
        )
        .split(",");

      if (d.depth == 1) {
        var angle = Math.atan2(transCoords[1], transCoords[0]);

        angle = angle * (180 / Math.PI);

        d3.select("svg")
          .select("g")
          .transition()
          .duration(4000)
          .attr(
            "transform",
            "translate(" +
            (width + 100) +
            "," +
            (height + 90) +
            ") rotate(" +
            angle * -1 +
            ")"
          );
      }

      d3.select(this).classed("selectedparent", true);
      depth++;
      fillinks = filterLinks();
      filnodes = filterNodes();
      updateUoS();
      /* console.log("FINISHED UPDATE");
     console.log("clicked node " + d.data.data.child); */

      d3.selectAll(".node").style("opacity", 0);
      d3.selectAll(".text").style("opacity", 0);
      d3.selectAll(".link").style("opacity", 0);

      //d3.selectAll("#root").style("opacity", 1);

      d3.selectAll("." + d3.select(this).attr("id")).style(
        "opacity",
        1
      );

      //siblings
      for (var j = 0; j < d.parent.children.length; j++) {
        var nodename = d.parent.children[j].data.id
          .replace(/ /g, "")
          .replace("(", "")
          .replace(")", "")
          .toLowerCase();

        d3.selectAll("." + d.parent.data.data.child).style(
          "opacity",
          1
        );

        d3.select("#" + nodename)
          .transition()
          .duration(2000)
          .style("fill", "blue")
          .style("opacity", 1);

        //  console.log("siblings " + d.parent.children[j].children.length);

        for (
          var jj = 0;
          jj < d.parent.children[j].children.length;
          jj++
        ) {
          nodename = d.parent.children[j].children[jj].data.data.child
            .replace(/ /g, "")
            .replace("(", "")
            .replace(")", "")
            .toLowerCase();

          // console.log(nodename);

          d3.select("#" + nodename)
            .transition()
            .duration(2000)
            //  .style("fill", "blue");
            .style("opacity", 0);
        }
      }

      console.log("ancestors " + d.ancestors().length);
      //ancestors
      for (var j = 0; j < d.ancestors().length; j++) {
        var nodename = d
          .ancestors()
        [j].data.data.child.replace(/ /g, "")
          .replace("(", "")
          .replace(")", "")
          .toLowerCase();

        console.log(nodename);
        d3.selectAll("." + nodename).style("opacity", 1);

        d3.select("#" + nodename)
          .transition()
          .duration(2000)
          .style("fill", "purple")
          .style("opacity", 1);

        //  console.log(nodename);
      }

      if (d.descendants().length > 1) {
        console.log("descendants " + d.descendants().length);
        //descendants
        for (var j = 0; j < d.descendants().length; j++) {
          var nodename = d
            .descendants()
          [j].data.data.child.replace(/ /g, "")
            .replace("(", "")
            .replace(")", "")
            .toLowerCase();

          d3.select("#" + nodename)
            .transition()
            .duration(2000)
            //  .style("fill", "yellow")
            .style("opacity", 1);

          // console.log(nodename);
        }
      }
    });

  node
    .append("text")
    .style("font-size", "10px")

    .attr("class", function (d) {
      return d.data.data.child
        .replace(/ /g, "")
        .replace("(", "")
        .replace(")", "")
        .toLowerCase();
    })
    .classed("text", true)
    .attr("dy", "2em")
    .attr("x", function (d) {
      return d.x < Math.PI === !d.children ? -40 : 25;
    })
    .attr("text-anchor", function (d) {
      return d.x < Math.PI === !d.children ? "start" : "end";
    })
    .attr("transform", function (d) {
      return (
        "rotate(" +
        ((d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) *
          180) /
        Math.PI +
        ")"
      );
    })
    .style("opacity", function (d) {
      if (d.depth <= depth) return 1;
      else return 0;
    })
    .text(function (d) {
      // console.log(d);
      return d.data.data.child;
    });
}

function radialPoint(x, y) {
  return [(y = +y) * Math.cos((x -= Math.PI / 2)), y * Math.sin(x)];
}

function fullRadialPoint(x, y) {
  return [(y = +y) * Math.cos((x -= Math.PI)), y * Math.sin(x)];
}

function transitionLevels() { }

function rotateViz() {
  //  console.log("rotate viz");
  node.transition().duration(2000).attrTween("transform", tween);

  function tween(d, i, a) {
    return d3.interpolateString(
      "rotate(-60, 150, 130)",
      "rotate(60, 150, 130)"
    );
  }
}

function filterNodes() {
  var selectedparent =
    document.getElementsByClassName("selectedparent");

  if (selectedparent == null)
    selectedparent = document.getElementById("root");

  //  console.log(selectedparent);

  var filnodes = root.descendants().filter(function (d) {
    // console.log(d.parent);
    return d.descendants().includes(d) && d.depth <= depth;
    //  return d.depth <= depth;
  });
  return filnodes;
}

function filterLinks() {
  var fillinks = root.links().filter(function (d) {
    return d.target.depth <= depth;
  });
  return fillinks;
}
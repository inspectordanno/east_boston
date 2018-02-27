  const map = {}

// margin template from https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0
// set the dimensions and margins of the graph
    map.margin = {top: 10, right: 10, bottom: 10, left: 10};
    map.width = document.getElementById("resize").offsetWidth - map.margin.left - map.margin.right;
    map.height = document.getElementById("resize").offsetHeight -  map.margin.top - map.margin.bottom;

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    map.svg = d3.select(".map_container").append("svg")
        .attr("width", map.width + map.margin.left + map.margin.right)
        .attr("height", map.height + map.margin.top + map.margin.bottom);

    map.map = map.svg.append("g")
        .attr("transform","translate(" + map.margin.left + "," + map.margin.top + ")");

d3.csv("js/merged_rents.csv", function(error, rents){

  // 42.372684, -71.020409

  const mercatorProjection = d3.geoMercator() //scale
        .scale(500000)
        // .rotate([71.057, 0])
        .center([-71.020409,  42.372684])
        .translate([width/2,200]);

  const geoPath = d3.geoPath() //generates path elements
        .projection(mercatorProjection);

  map.basemap = map.map
    .append("g")
    .attr("id", "basemap");

    map.points = map.map
      .append("g")
      .attr("id", "points");

  map.basemap.selectAll("path")
      .data(neighborhoods_json.features)
      .enter()
      .append("path")
      .attr("d", geoPath); // path generator

  rents.forEach((d) => {
      	 var xy = mercatorProjection([d.long, d.lat]);
         console.log(xy);
      	 var x  = xy[0];
      	 var y = xy[1];
         map.points.append("circle")
          .attr("cx",x)
          .attr("cy",y)
          .attr("r",3)
          .attr("fill","red");
      	})
});

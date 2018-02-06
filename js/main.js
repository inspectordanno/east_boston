
// margin template from https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(".svg_container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    var averages = {};

    d3.csv("js/sample_rents.csv", function(error, rents){


      // averages["test"] = 0;


    //calculating averages for each year

      for (var no = 0; no <= 8; no++) {

      var averages_by_bedroom = [];

        var subset = rents.filter(function(d){
          return d.no_bedrooms == no;

        })

           for (var year = 2013; year <= 2017; year++) {

              var avg= d3.mean(subset, function(d){
                if (d.year == year) {
                  return +d.price;
                }
              });

              if(avg !== undefined) {
                averages_by_bedroom.push({"year": year, "avg": avg});
              }


          }
          averages[no] = averages_by_bedroom;

      }

      console.log(averages);

      // X scale

    var xScale = d3.scalePoint()
      .domain([2013, 2014, 2015, 2016, 2017]) // input
      .range([0, width]); // output

    // Y scale

    var yScale = d3.scaleLinear()
      .domain([0, 1000])
      .range([height, 0]);


    //line generator

    var line = d3.line()     //set x values for the line generator
      .x(function(d,i) {
        return xScale(d.year);
      })


      .y(function(d,i) {      //set y values for the line generator
        return yScale(d.avg);
      })

      .curve(d3.curveMonotoneX); //apply smoothing to the line

    // call the x axis in a group tag

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale)); // create an axis component with d3.axisBottom

    // call the y axis in a group tag

    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale)); //create an axis component with d3.axisLeft

    // append the path, bind the data, and call the line generator, use attr to style lines


    svg.append("path")
      .datum(averages[0]) //binds data to the line
      .attr("class", "line") //assigns a class for styling
      .attr("d", line); //calls the line generator

      svg.append("path")
        .datum(averages[1]) //binds data to the line
        .attr("class", "line") //assigns a class for styling
        .attr("d", line); //calls the line generator

        svg.append("path")
          .datum(averages[2]) //binds data to the line
          .attr("class", "line") //assigns a class for styling
          .attr("d", line); //calls the line generator

          svg.append("path")
            .datum(averages[3]) //binds data to the line
            .attr("class", "line") //assigns a class for styling
            .attr("d", line); //calls the line generator

      // appends a circle for each datapoint

      svg.selectAll(".dot")
        .data(averages[0])
        .enter()
        .append("circle") //append a circle
        .attr("class", "dot") //assign a class for styling
        .attr("cx", function(d, i) {
              return xScale(d.year);
            })
        .attr("cy", function(d) {
              return yScale(d.avg);
            })
        .attr("r", 5);






      console.log(averages);








    })

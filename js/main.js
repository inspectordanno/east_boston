
// margin template from https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0
// set the dimensions and margins of the graph
    var margin = {top: 20, right: 60, bottom: 30, left: 50};
    var width = document.getElementById("resize").offsetWidth - margin.left - margin.right;
    var height = document.getElementById("resize").offsetHeight -  margin.top - margin.bottom;

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

    var thirtyPercent =
    [ {year: 2013, avg: (48704/12)*.30},
      {year: 2014, avg: (50336/12)*.30},
      {year: 2015, avg: (51097/12)*.30},
      {year: 2016, avg: (52152/12)*.30},
      {year: 2017, avg: (54000/12)*.30}
    ];

    console.log(thirtyPercent);

    d3.csv("js/merged_rents.csv", function(error, rents){


      // averages["test"] = 0;


    //calculating averages for each year

      for (var no = 0; no <= 8; no++) {

      var averages_by_bedroom = [];

        var subset = rents.filter(function(d){
          return d.no_bedrooms == no;
        });

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
      .domain([0, 3000])
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

    var dollarFormat = function(d) {
      return '$' + d;
    };

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale)); // create an axis component with d3.axisBottom

    // call the y axis in a group tag

    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale).tickFormat(dollarFormat)); //create an axis component with d3.axisLeft

    // append the path, bind the data, and call the line generator, use attr to style lines


    //studio apartment

    svg.append("path")
      .datum(averages[0]) //binds data to the line
      .attr("class", "line") //assigns a class for styling
      .attr("d", line); //calls the line generator



    //1 bedroom apartment
      svg.append("path")
        .datum(averages[1]) //binds data to the line
        .attr("class", "line") //assigns a class for styling
        .attr("d", line) //calls the line generator
        .attr("stroke", "	#aad356" ); //stroke green

    //2 bedroom apartment
        svg.append("path")
          .datum(averages[2]) //binds data to the line
          .attr("class", "line") //assigns a class for styling
          .attr("d", line); //calls the line generator


    //3 bedroom apartment
          svg.append("path")
            .datum(averages[3]) //binds data to the line
            .attr("class", "line") //assigns a class for styling
            .attr("d", line) //calls the line generator
            .attr("stroke", "#189aa8" ); //stroke blue

    //thirty percent median household income
          svg.append("path")
            .datum(thirtyPercent) //binds data to the line
            .attr("class", "line") //assigns a class for styling
            .attr("d", line) //calls the line generator
            .attr("stroke", "#e45525" ); //stroke red

      // appends a circle for each datapoint

      var br1 = svg.selectAll(".dots_1br")
        .data(averages[1])
        .enter()
        .append("g")
          .attr("transform", function(d) {
            console.log("translate(" + xScale(d.year) + "," + yScale(d.avg) +")");
            return "translate(" + xScale(d.year) + "," + yScale(d.avg) +")";
          });

        br1.append("circle")
          .attr("class", "dot")
          .attr("r", 4);

        var br3 = svg.selectAll(".dots_3br")
          .data(averages[3])
          .enter()
          .append("g")
            .attr("transform", function(d) {
              console.log("translate(" + xScale(d.year) + "," + yScale(d.avg) +")");
              return "translate(" + xScale(d.year) + "," + yScale(d.avg) +")";
            });

          br3.append("circle")
            .attr("class", "dot")
            .attr("r", 4);

        var household = svg.selectAll("thirtyPercent")
          .data(thirtyPercent)
          .enter()
          .append("g")
            .attr("transform", function(d) {
              console.log("translate(" + xScale(d.year) + "," + yScale(d.avg) +")");
              return "translate(" + xScale(d.year) + "," + yScale(d.avg) +")";
            });

          household.append("circle")
            .attr("class", "dot")
            .attr("r", 4);

        br1.append("text")
          .attr("dx", ".50em")
          .attr("dy",".90em")
          .text(function(d){return "$"+ Math.round(d.avg);});


        br3.append("text")
          .attr("dx", ".50em")
          .attr("dy",".90em")
          .text(function(d){return "$"+ Math.round(d.avg);});


        household.append("text")
          .attr("dx", ".50em")
          .attr("dy",".90em")
          .text(function(d){return "$"+ Math.round(d.avg);});

          svg.append("text")
            .attr("x", width)
            .attr("y", yScale(averages[3][4]["avg"]) - 10)
            .attr("text-anchor","end")
            .text("average 3BR rent")
            .attr("fill", "#189aa8")
            .attr("font-weight", "bold");

          svg.append("text")
            .attr("x", width)
            .attr("y", yScale(averages[1][4]["avg"]) - 10)
            .attr("text-anchor","end")
            .text("average 1BR rent")
            .attr("fill", "#aad356")
            .attr("font-weight", "bold");

          svg.append("text")
            .attr("x", width)
            .attr("y", yScale(thirtyPercent[4]["avg"]) - 10)
            .attr("text-anchor","end")
            .text("rent poverty line")
            .attr("fill", "#e45525")
            .attr("font-weight", "bold");











      console.log(averages);








    });

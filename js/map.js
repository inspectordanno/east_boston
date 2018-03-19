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
        .attr("transform","scale(1.75)translate(" + map.margin.left + "," + map.margin.top + ")");


    //slider https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518

    var slider1 = d3.sliderHorizontal()
       // .min(d3.min(data1))
       // .max(d3.max(data1))
       .width(500)
       .min([40000])
       .max([100000])
       .ticks(5)
       .default(100000);

    map.slider = map.svg.append("g")
      .attr('transform', 'translate(20, 10)')
      .attr('height', 500)
      .call(slider1);

    slider1.on('onchange', val => {
      console.log(val);
      //calculate 30 percent of the val
      monthlyThirtyPercentVal = (.30 * val) / 12;
      // console.log(monthlyThirtyPercentVal);
      // map.points.selectAll("circle").attr("opacity",1);
      // map.points.selectAll("circle").filter(function(d){
      //   return d.price > monthlyThirtyPercentVal;
      // })
      // .attr('opacity', 0);

      map.points.selectAll("circle")
        .attr("opacity", function(d) {
            if(d.price > monthlyThirtyPercentVal) {
                return 0;

            } else {
              return 1;
            }

        });
      // const oneBedroom2017 = subset2017.filter(function(d){ //filters 2017 data with 1 bedroom
      //   return d.no_bedrooms == 1;
      // });



    });

    //basemap generation courtesy of https://github.com/shingyun/eastboston-evictions

    const projection = d3.geoMercator(); //use geomercator projection
    const path = d3.geoPath().projection(projection); // create path based on projection

    projection
    	.center([-71,42]) //center the project based on lat long
    	.scale(350000);   //scale the projection

    d3.queue() //queue the data
      .defer(d3.csv, 'data/merged_rents.csv') //rent data
      .defer(d3.json, 'data/Boston_Neighborhoods.geojson') //Boston geojson
      .defer(d3.json,'data/eastBostonCensusTracts.geojson')
      .await(dataLoaded); //wait until all data is loaded

    function dataLoaded (err, rents, boston, eastie) { //create a function with variable error, rent data, and geojson

      //get only 2017 data for 1 bedroom and 3 bedrooms

      const subset2017 = rents.filter(function(d){ //filters only 2017 data
        return d.year == 2017;
      });

      console.log(subset2017);

      const oneBedroom2017 = subset2017.filter(function(d){ //filters 2017 data with 1 bedroom
        return d.no_bedrooms == 1;
      });

      console.log(oneBedroom2017);

      const threeBedroom2017 = subset2017.filter(function(d){ //filters 2017 data with 3 bedroom
        return d.no_bedrooms == 3;
      });

      console.log(threeBedroom2017);

      //boston basemap

        map.map.append("g") // append a new g element
        .attr('class','baseMap') // give it a class of basemap
        .attr('transform','translate(-75,3100)') // translate it relative to ?
        // console.log(boston.features);
      .selectAll('.base') // select the .base class
        .data(boston.features) // bind the geojson features
        .enter() // enter the data
        .append('path') // append a path
        .attr('class','base') // give it a class of base
        .attr('d',path); // give it a d attribute which is populated with the mercator projection

      //east boston basemap
        map.map.append('g')
          .attr('class','censusMap')
          .attr('transform','translate(-75,3100)')
	        .selectAll('.censusTract')
	        .data(eastie.features)
	        .enter()
	        .append('path')
	        .attr('class','censusTract')
	        .attr('d',path)
		    // .style('fill',function(d){
		    // 	 var incomeMapping = dataMapping.get(d.properties.geoid).median_household_income
		    // 	 //var raceMapping = dataMapping.get(d.properties.geoid).percentage_hispanic_latino
        //          return scaleColorIncome(incomeMapping);
		    // })
		    .style('stroke-width','1.5px')
		    .style('stroke','white')
		    .style('opacity',0.85)
        .style('fill', 'white');

        // points layer

        map.points = map.map
            .append("g")
            .attr('transform','translate(-75,3100)')
            .attr("id", "points");

        //
        // var tpoints = map.points
        //   .selectAll("circle")
        //   .data(rents.filter(function(d) {
        //       return (d.year == 2013 || d.year == 2017) && (d.no_bedrooms == 1 || d.no_bedrooms == 3);
        //   }))
        //   .enter()
        //   .append("circle")
        //   .attr("cx", function(d){
        //     return projection([d.long, d.lat])[0];
        //   })
        //   .attr("cy", function(d){
        //     return projection([d.long, d.lat])[1];
        //   })
        //   .attr("r",3)
        //   .attr("fill",function(d) {
        //       if(d.no_bedrooms == 1) {
        //         return "green";
        //       } else if(d.no_bedrooms == 3) {
        //         return "blue";
        //       }
        //
        //   });

        var points1br = map.points
          .selectAll(".circle1br")
          .data(oneBedroom2017)
          .enter()
          .append("circle")
          .attr("class","circle1br")
          .attr("cx", function(d){
            return projection([d.long, d.lat])[0];
          })
          .attr("cy", function(d){
            return projection([d.long, d.lat])[1];
          })
          .attr("r",3)
          .attr("fill","#aad356");


          var points3br = map.points
            .selectAll(".circle3br")
            .data(threeBedroom2017)
            .enter()
            .append("circle")
            .attr("class","circle3br")
            .attr("cx", function(d){
              return projection([d.long, d.lat])[0];
            })
            .attr("cy", function(d){
              return projection([d.long, d.lat])[1];
            })
            .attr("r",3)
            .attr("fill","#189aa8");




//get the current value of the slider


//change opacity with slider











      // rents.forEach((d) => { // for each data point, loop through
      //        console.log(d.lat);
      //     	 var xy = projection([d.long, d.lat]); //create a variable xy that creates two values based on the mercator projection output of the longitude and latitude of each point
      //        console.log(xy); //console.log these values to see what they are
      //     	 var x  = xy[0]; //put mercatored longitude values in x variable
      //     	 var y = xy[1]; //put mercatored latitude values in y variable
      //        // y = map.height/2;
      //        map.points.append("circle") // append a circle to the points g element
      //         .attr("cx",function (d){
      //           return projection([d.long, d.lat])[0];
      //         }) // cx position is mercatored longitude
      //         .attr("cy",y) // cy position is mercatored latitude
      //         .attr("r",3) // radius of 3
      //         .attr("fill","red"); // color of red
      //     	});

      };







//   map.basemap = map.map
//     .append("g")
//     .attr("id", "basemap");
//
//     map.points = map.map
//       .append("g")
//       .attr("id", "points");
//
//   map.basemap.selectAll("path")
//       .data(neighborhoods_json.features)
//       .enter()
//       .append("path")
//       .attr("d", geoPath); // path generator
//
//   rents.forEach((d) => {
//       	 var xy = mercatorProjection([d.long, d.lat]);
//          console.log(xy);
//       	 var x  = xy[0];
//       	 var y = xy[1];
//          map.points.append("circle")
//           .attr("cx",x)
//           .attr("cy",y)
//           .attr("r",3)
//           .attr("fill","red");
//       	})
// });

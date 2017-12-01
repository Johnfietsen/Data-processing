/*
	d3line.js

	Author:   L.K. Stefelmanns
	Course:   Data processing
	Study:    Minor Programming, University of Amsterdam

	Sources:
	https://bl.ocks.org/basilesimon/29efb0e0a43dde81985c20d9a862e34e
	https://stackoverflow.com/questions/38687588/add-horizontal-crosshair-to-d3-js-chart
	https://bl.ocks.org/d3noob/119a138ef9bd1d8f0a8d57ea72355252
	http://bl.ocks.org/d3noob/e99a762017060ce81c76
*/

window.onload = function(){

    RESCALE = 1 / 10;
	AREA_OPACITY = 0.2;
	FONT_SIZE = 14
	FONT = "Cambria";
	TEXT_SPACE = 3 * FONT_SIZE;
	DOT_SIZE = 5;

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 50, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%m%d");

	// assign colors to income category with an ordinal scale
	var color = d3.scaleOrdinal()
		.range(["green", "blue", "red"])
		.domain(["1901", "1962", "2016"]);

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var average = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.ave_temp); });

    // define the area
    var area = d3.area()
        .x(function(d) { return x(d.date); })
        .y0(function(d) { return y(d.min_temp); })
        .y1(function(d) { return y(d.max_temp); });

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


	// create text area for information
	var text_info1 = svg.append("text")
		.attr("opacity", 0)
		.attr("class", "legend")
		.attr("y", margin.top);

	var text_info2 = svg.append("text")
		.attr("opacity", 0)
		.attr("class", "legend")
		.attr("y", 2*margin.top);

	// create dot for 'crosshair'
	var dot1 = svg.append("circle")
	    .attr("opacity", 0)
	    .attr("stroke", "none")
		.attr("fill", "black")
		.attr("r", DOT_SIZE)
	    .attr("pointer-events", "none");

	var dot2 = svg.append("circle")
	    .attr("opacity", 0)
	    .attr("stroke", "none")
		.attr("fill", "black")
		.attr("r", DOT_SIZE)
	    .attr("pointer-events", "none");

    // Get the data
    d3.json("KNMI_data.json", function(error, data) {
        if (error) throw error;

        // format the data
        data.forEach(function(d) {
            d.date = parseTime(d.date);
            d.ave_temp = +d.ave_temp * RESCALE;
            d.min_temp = +d.min_temp * RESCALE;
            d.max_temp = +d.max_temp * RESCALE;
        });


		// Nest the entries by year
		var data_nest = d3.nest()
			.key(function(d) {return d.year;})
			.entries(data);

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([d3.min(data, function(d) {
                    return Math.min(d.ave_temp, d.min_temp, d.max_temp); }),
                  d3.max(data, function(d) {
                    return Math.max(d.ave_temp, d.min_temp, d.max_temp); })]);

	    legendSpace = height/data_nest.length * RESCALE; // spacing for the legend

	    // Loop through each symbol / key
	    data_nest.forEach(function(d,i) {

	        svg.append("path")
	            .attr("class", "line")
	            .style("stroke", function() { // Add the colours dynamically
	                return d.color = color(d.key); })
	            .attr("id", "tag_path" + d.key) // assign ID
	            .attr("d", average(d.values));

			// add the area
	        svg.append("path")
	            .attr("class", "area")
	            .style("fill", function() {
					return d.color = color(d.key);	})
	            .style("opacity", AREA_OPACITY)
				.attr("id", "tag_area" + d.key)
	            .attr("d", area(d.values));

	        // Add the Legend
	        svg.append("text")
				.attr("x", 80+30*i*legendSpace)  // space legend
				.attr("y", height + (margin.bottom/2)+ 5)
	            .attr("class", "legend")    // style the legend
	            .style("fill", function() { // Add the colours dynamically
	                return d.color = color(d.key); })
	            .on("click", function(){
	                // Determine if current line is visible
	                var active   = d.active ? false : true,
	                opacity_line = active ? 0 : 1;
	                // Hide or show the elements based on the ID
	                d3.select("#tag_path" + d.key)
	                    .transition().duration(100)
	                    .style("opacity", opacity_line);
					opacity_area = active ? 0 : AREA_OPACITY;
					d3.select("#tag_area" + d.key)
						.transition().duration(100)
						.style("opacity", opacity_area)
	                // Update whether or not the elements are active
	                d.active = active;
	                })
	            .text(d.key);
	    });

		// add title
        svg.append("text")
                .attr("x", 5)
                .attr("y", 10)
                .attr("text-anchor", "left")
                .style("font-size", "16px")
                .text("Temperatures of coldest (1962) and warmest (2016) year");

        // add subtitle
        svg.append("text")
				.attr("x", 5)
				.attr("y", 30)
                .attr("text-anchor", "left")
                .style("font-size", "16px")
                .text("Maker: L.K. Stefelmanns Source: KNMI");

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
			.attr("font", FONT);

		// text label for the x axis
	    svg.append("text")
	        .attr("transform",
	              "translate(" + (width/2) + " ," +
	                             (height + margin.top + 20) + ")")
			.attr("font", FONT)
	        .style("text-anchor", "middle")
	        .text("Month");


        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y))
			.attr("font", FONT);

		// text label for the y axis
		svg.append("text")
		    .attr("transform", "rotate(-90)")
		    .attr("y", 0 - margin.left)
		    .attr("x",0 - (height / 2))
		    .attr("dy", "1em")
			.attr("font", FONT)
		    .style("text-anchor", "middle")
		    .text("Temperature (celcius)");

		// create transparent rectangle to track mouse movement
		var trans_rect = svg.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", width)
			.attr("height", height)
			.attr("fill", "white")
			.attr("opacity", 0)
			.attr("id", "overlay");

		// position lines on mouseover
		trans_rect.on("mousemove", function(){
					  mouse = d3.mouse(this);
					  text_info1.data([data_nest[0].values])
					  	.attr("x", mouse[0])
						.text(function(d) {
								return d[parseInt(mouse[0] * d.length / width)]
  							  			.ave_temp.toFixed(2);
						})
						.attr("opacity", 1)
						.style("text-anchor", "middle")
						.attr("fill", function(d) {
							return color("1962");	});
					  text_info2.data([data_nest[1].values])
						.attr("x", mouse[0])
						.text(function(d) {
								return d[parseInt(mouse[0] * d.length / width)]
										.ave_temp.toFixed(2);
						})
						.attr("opacity", 1)
						.style("text-anchor", "middle")
						.attr("fill", function(d) {
							return color("2016");	});
					  dot1.data([data_nest[0].values])
					  	.attr("cx", mouse[0])
					    .attr("cy", function(d) {
							  return y(d[parseInt(mouse[0] * d.length / width)]
							  			.ave_temp); })
						.attr("opacity", 1)
						.style("fill", function(d) {
							return color("1962");	});
					  dot2.data([data_nest[1].values])
					  	.attr("cx", mouse[0])
					    .attr("cy", function(d) {
						  	  return y(d[parseInt(mouse[0] * d.length / width)]
									    .ave_temp); })
					    .attr("opacity", 1)
						.style("fill", function(d) {
							return color("2016");	});
					});

    });
};

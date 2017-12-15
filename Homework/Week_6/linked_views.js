/*
	d3line.js

	Author:   L.K. Stefelmanns
	Course:   Data processing
	Study:    Minor Programming, University of Amsterdam

	Sources:
	http://bl.ocks.org/hopelessoptimism/5d558563599aea1bfab93089a4036c22
	http://bl.ocks.org/jhubley/17aa30fd98eb0cc7072f
	https://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_navbar&stacked=h
*/

// functies buiten windo.onload

var global_gdp;

window.onload = function(){

	function filterJSON(json, key, value) {
		var result = [];

		json.forEach(function(val, idx, arr){
			if(val[key] == value){
				result.push(val);
			}
		})
		return result;
	}


	// set the dimensions for the network svg
	var	width_network = 1200;
		height_network = 600;

	var legend_size = 30;
		legend_spacing = legend_size / 3;

	// set the dimensions and margins of the graph svg
	var margin_graph = {top: 20, right: 20, bottom: 50, left: 50},
		width_graph = 1000 - margin_graph.left - margin_graph.right,
		height_graph = 400 - margin_graph.top - margin_graph.bottom;

	var FONTSIZE = 16;
	var FONT = "Verdana";
	var DOT_SIZE = 5;


	var simulation = d3.forceSimulation()
	    .force("link", d3.forceLink().id(function(d) { return d.id; }))
	    .force("charge", d3.forceManyBody().strength(-400))
	    .force("center", d3.forceCenter(width_network / 2, height_network / 2));


	var colour = d3.scaleLinear()
					.range(["#3333ff", "#3366ff", "#6699ff", "#99ccff", "#e6f2ff"])
					.domain([200, 150, 100, 50, 0]);

	var size = d3.scaleSqrt()
					.range([8, 30])
					.domain([0, 8000000000000]);


	// parse the date / time
    var parse_time = d3.timeParse("%Y");

    // set the ranges
    var x = d3.scaleTime().range([0, width_graph]);
    var y = d3.scaleLinear().range([height_graph, 0]);

    // define the line
    var line = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.GDP_growth); });

	// append the svg objects
	var network = d3.select("body").append("svg")
        .attr("width", width_network)
        .attr("height", height_network);
      // .append("g");

    var graph = d3.select("body").append("svg")
        .attr("width", width_graph + margin_graph.left + margin_graph.right)
        .attr("height", height_graph + margin_graph.top + margin_graph.bottom)
    	.append("g")
        .attr("transform",
              "translate(" + margin_graph.left + "," + margin_graph.top + ")");

	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);


	d3.queue()
		.defer(d3.json, 'RTAs.json')
		.defer(d3.json, 'GDP_growth.json')
		.await(create_linked_views);

	function update_graph(gdp) {

		// remove previous graph
		d3.selectAll("path.line").remove();
		d3.selectAll("#title").remove();
		d3.selectAll(".axis").remove();
		d3.selectAll("#info").remove();
		d3.selectAll(".dot").remove();

		x.domain(d3.extent(gdp, function(d) { return d.year; }));
	    y.domain(d3.extent(gdp, function(d) { return d.GDP_growth; }));


		var text_info = graph.append("text")
			.attr("id", "info")
			.attr("opacity", 0)
			.attr("class", "legend")
			.attr("y", margin_graph.top);

		// create dot for 'crosshair'
		var dot = graph.append("circle")
			.attr("class", "dot")
			.attr("opacity", 0)
			.attr("r", DOT_SIZE)
			.attr("pointer-events", "none");


	    graph.append("g")
	        .attr("transform", "translate(0," + height_graph + ")")
	        .call(d3.axisBottom(x))
	    	.select(".domain")
	        .remove();

	    // graph.append("g")
	    //     .call(d3.axisLeft(y))
	      // .append("text")
	      //   .attr("fill", "#000")
	      //   .attr("transform", "rotate(-90)")
	      //   .attr("y", 6)
	      //   .attr("dy", "0.71em")
	      //   .attr("text-anchor", "end")
	      //   .text("GDP growth")

	    graph.append("path")
				.attr("class", "line")
		        .data([gdp])
		        .attr("fill", "none")
		        .attr("stroke", "steelblue")
		        .attr("stroke-linejoin", "round")
		        .attr("stroke-linecap", "round")
		        .attr("stroke-width", 1.5)
		        .attr("d", function(d, i) { return line(d); });


		// add title
        graph.append("text")
				.attr("id", "title")
				.data([gdp])
                .attr("x", width_graph / 2)
                .attr("y", 0 - (margin_graph.top / 2) + 10)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text(function(d) { return d[0].Country_Name; });

        // add subtitle
        graph.append("text")
				.attr("id", "subtitle")
                .attr("x", 0)
                .attr("y", 16 - (margin_graph.top / 2))
                .attr("text-anchor", "left")
                .style("font-size", "16px")
                .text("");

        // add the x Axis
        graph.append("g")
				.attr("class", "axis")
	            .attr("transform", "translate(0," + height_graph + ")")
	            .call(d3.axisBottom(x))
				.attr("font", FONT);

		// text label for the x axis
	    graph.append("text")
		        .attr("transform",
		              "translate(" + (width_graph/2) + " ," +
		                             (height_graph + margin_graph.top + 20) + ")")
				.attr("font", FONT)
				.attr("class", "axis")
		        .style("text-anchor", "middle")
		        .text("Year");


        // add the y Axis
        graph.append("g")
	            .call(d3.axisLeft(y))
				.attr("class", "axis")
				.attr("font", FONT);

		// text label for the y axis
		graph.append("text")
			    .attr("transform", "rotate(-90)")
			    .attr("y", 0 - margin_graph.left)
			    .attr("x",0 - (height_graph / 2))
			    .attr("dy", "1em")
				.attr("font", FONT)
				.attr("class", "axis")
			    .style("text-anchor", "middle")
			    .text("GDP growth (annual)");


		// create transparent rectangle to track mouse movement
		var trans_rect = graph.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", width_graph)
			.attr("height", height_graph)
			.attr("fill", "white")
			.attr("opacity", 0)
			.attr("id", "overlay");

		// position lines on mouseover
		trans_rect.on("mousemove", function(){
					  mouse = d3.mouse(this);
					  text_info.data([gdp])
					  	.attr("x", mouse[0])
						.text(function(d) {
								return "GDP growth  " +
								d[parseInt(mouse[0] * d.length / width_graph)]
  							  	 .GDP_growth.toFixed(2);
						})
						.attr("opacity", 1)
						.style("text-anchor", "middle")
						.attr("fill", "black");
					  dot.data([gdp])
					  	.attr("cx", mouse[0])
					    .attr("cy", function(d) {
							  return y(d[parseInt(mouse[0] * d.length / width_graph)]
							  			.GDP_growth); })
						.attr("opacity", 1)
						.style("fill", "steelbue");
					});
	}


	function mouse_click(selection) {

		console.log(selection);

		var line_data = filterJSON(global_gdp, "Country_Name", selection);

		update_graph(line_data);
	}


	function create_linked_views(error, rta, gdp) {
		if (error) throw error;

		global_gdp = gdp;

		// format the data
		gdp.forEach(function(d) {
			d.year = parse_time(d.year);
			d.GDP_growth = +d.GDP_growth;
		});

		var selection = "World";

		var data = filterJSON(gdp, "Country_Name", selection);

		update_graph(data);

		rta.links.forEach(function(d){
			d.source = d.source_id;
			d.target = d.target_id;
		});

		// add title
        network.append("text")
				.attr("id", "title")
				.data([gdp])
                .attr("x", 0)
                .attr("y", height_network - 2 *FONTSIZE)
                .attr("text-anchor", "left")
                .style("font-size", FONTSIZE)
                .text("Regional trade agreements between countries");

        // add subtitle
        network.append("text")
				.attr("id", "subtitle")
                .attr("x", 0)
                .attr("y", height_network - FONTSIZE)
                .attr("text-anchor", "left")
                .style("font-size", FONTSIZE)
                .text("Colour represents % of GDP formed by trade, size represents total GDP");

		var link = network.append("g")
					.style("stroke", "#aaa")
					.selectAll("line")
					.data(rta.links)
					.enter().append("line");

		var node = network.append("g")
					.attr("class", "nodes")
					.selectAll("circle")
					.data(rta.nodes)
					.enter().append("circle")
					// .attr("r", 20)
					.on("click", function(d) { mouse_click(d.name); })
					.on("dblclick", function(d) { mouse_click("World"); });
					// .call(d3.drag()
					// 	.on("start", dragstarted)
					// 	.on("drag", dragged)
					// 	.on("end", dragended));

		var label = network.append("g")
					.attr("class", "labels")
					.selectAll("text")
					.data(rta.nodes)
					.enter().append("text")
					.attr("class", "label")
					.text(function(d) { return d.name; });


	    var legend = network.append("g")
				    .selectAll("g")
				    .data(colour.domain())
				    .enter()
				    .append('g')
					.attr('class', 'legend')
					.attr('transform', function(d, i) {
						var height = legend_size;
						var x = 0;
						var y = i * height;
						return 'translate(' + x + ',' + y + ')';
				    });

	    legend.append('rect')
				    .attr('width', legend_size)
				    .attr('height', legend_size)
				    .style('fill', colour)
				    .style('stroke', colour);

		legend.append('text')
				    .attr('x', legend_size + legend_spacing)
				    .attr('y', legend_size - legend_spacing)
				    .text(function(d) { return d + "%"; });


		simulation
					.nodes(rta.nodes)
					.on("tick", ticked);

		simulation.force("link")
					.links(rta.links);

		function ticked() {

		    link
		        .attr("x1", function(d) { return d.source.x; })
		        .attr("y1", function(d) { return d.source.y; })
		        .attr("x2", function(d) { return d.target.x; })
		        .attr("y2", function(d) { return d.target.y; });

		    node
		        .attr("r", function(d){ return size(d.GDP_total); })
		        .style("fill", function(d){ if (d.trade_ofGDP == "Unknown") {
				 								return "grey"; }
										 	else {
										 		return colour(d.trade_ofGDP); };
										})
		        .style("stroke", "none")
		        // .style("stroke-width", "4px")
		        .attr("cx", function(d) { return d.x; })
		        .attr("cy", function(d) { return d.y; });

		    label
	    		.attr("x", function(d) { return d.x; })
	            .attr("y", function (d) { return d.y + 2; })
	            .style("font-size", "10px").style("fill", "black")
				.attr("text-anchor", "middle");

		}
	};


	function dragstarted(d) {
	  if (!d3.event.active) simulation.alphaTarget(0.3).restart()
	  simulation.fix(d);
	}

	function dragged(d) {
	  simulation.fix(d, d3.event.x, d3.event.y);
	}

	function dragended(d) {
	  if (!d3.event.active) simulation.alphaTarget(0);
	  simulation.unfix(d);
	}
}

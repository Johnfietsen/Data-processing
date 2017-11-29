//
//  d3line.js
//
//  Author:   L.K. Stefelmanns
//  Course:   Data processing
//  Study:    Minor Programming, University of Amsterdam
//
//  Sources:
//	https://bl.ocks.org/basilesimon/29efb0e0a43dde81985c20d9a862e34e
//	https://bl.ocks.org/micahstubbs/e4f5c830c264d26621b80b754219ae1b
//	https://bl.ocks.org/d3noob/119a138ef9bd1d8f0a8d57ea72355252

window.onload = function(){

    RESCALE = 1 / 10;

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%Y%m%d");

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

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

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

        // sort years ascending
        data.sort(function(a, b){
            return a["date"]-b["date"];
        })

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([d3.min(data, function(d) {
                    return Math.min(d.ave_temp, d.min_temp, d.max_temp); }),
                  d3.max(data, function(d) {
                    return Math.max(d.ave_temp, d.min_temp, d.max_temp); })]);


		const focus = svg.append('g')
	      .attr('class', 'focus')
	      .style('display', 'none');

	    focus.append('circle')
	      .attr('r', 4.5);

	    focus.append('line')
	      .classed('x', true);

	    focus.append('line')
	      .classed('y', true);

	    focus.append('text')
	      .attr('x', 9)
	      .attr('dy', '.35em');

        // Add the average path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "blue")
            .attr("d", average);

        // add the area
        svg.append("path")
            .data([data])
            .attr("class", "area")
            .style("fill", "blue")
            .style("opacity", "0.4")
            .attr("d", area);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

		function mousemove() {
			const x0 = x.invert(d3.mouse(this)[0]);
			const i = bisectDate(data, x0, 1);
			const d0 = data[i - 1];
			const d1 = data[i];
			const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
			focus.attr('transform', `translate(${x(d.date)}, ${y(d.ave_temp)})`);
			focus.select('line.x')
				.attr('x1', 0)
				.attr('x2', -x(d.date))
				.attr('y1', 0)
				.attr('y2', 0);

			focus.select('line.y')
				.attr('x1', 0)
				.attr('x2', 0)
				.attr('y1', 0)
				.attr('y2', height - y(d.ave_temp));

			focus.select('text').text(formatCurrency(d.ave_temp));
	    }
	});

};

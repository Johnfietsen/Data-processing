////////////////////////////////////////////////////////////////////////////////
//  scatterplot.js
//
//  Author:   L.K. Stefelmanns
//  Course:   Data processing
//  Study:    Minor Programming, University of Amsterdam
////////////////////////////////////////////////////////////////////////////////


var width = 960,
    height = 500;

var x = d3.scale.ordinal()
    .rangeRoundBands([20, width], .1);

var y = d3.scale.linear()
    .range([height + 20, 0]);

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

//Import dataset
d3.json("scatterplot.json", function(error, data){
    if (error) throw error;
    x.domain(data.map(function(d) { return d.COtwo; }));
    y.domain([0, d3.max(data, function(d) { return d.GDP_growth; })]);

    var bar = chart.selectAll("g")
        .data(data)
      .enter().append("g")
        .attr("transform", function(d) {
                                        return "translate(" + x(d.COtwo) + ",0)";
                                        });

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    bar.append("rect")
        .attr("y", function(d) { return y(d.GDP_growth); })
        .attr("height", function(d) { return height - y(d.GDP_growth); })
        .attr("width", x.rangeBand());

    bar.append("text")
        .attr("x", x.rangeBand() / 2)
        .attr("y", function(d) { return y(d.GDP_growth) + 3; })
        .attr("dy", ".75em")
        .text(function(d) { return d.GDP_growth; });
  });


function type(d) {
    d.GDP_growth = +d.GDP_growth; // coerce to number
    return d;
}

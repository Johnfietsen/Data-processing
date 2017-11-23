////////////////////////////////////////////////////////////////////////////////
//  scatterplot.js
//
//  Author:   L.K. Stefelmanns
//  Course:   Data processing
//  Study:    Minor Programming, University of Amsterdam
////////////////////////////////////////////////////////////////////////////////


var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var z = d3.scale.linear()
    .range([0, 10]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("scatterplot.json", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.COtwo = +d.COtwo;
    d.GDP_growth = +d.GDP_growth;
  });

  x.domain(d3.extent(data, function(d) { return d.GDP_growth; })).nice();
  y.domain(d3.extent(data, function(d) { return d.COtwo; })).nice();
  // z.domain(d3.extent(data, function(d) { return d.GDP_total; })).nice();


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("GDP growth (perc)");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("CO2 (tn)")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)//function(d) { return z(d.GDP_total); })
      .attr("cx", function(d) { return x(d.GDP_growth); })
      .attr("cy", function(d) { return y(d.COtwo); })
      .style("fill", function(d) { return color(d.income_category); });

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
                                         return "translate(0," + i * 20 + ")";
                                        });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});

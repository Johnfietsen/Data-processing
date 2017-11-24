//
//  scatterplot.js
//
//  Author:   L.K. Stefelmanns
//  Course:   Data processing
//  Study:    Minor Programming, University of Amsterdam
//
// Javascript imported by scatterplot.html to create the scatterplot based on
// data from scatterplot.json.
//

window.onload = function(){

    // assign margins and use them to create canvas for the html
    var margin = {top: 50, right: 20, bottom: 30, left: 60},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // scale the x axis based on GDP growth
    var x = d3.scale.linear()
        .range([0, width]);

    // scale the y axis based on CO2 emmissions
    var y = d3.scale.linear()
        .range([height, 0]);

    // scale the size of the dot based on country GDP
    var z = d3.scale.linear()
        .range([3, 40]);

    // assign colors to income category with an ordinal scale
    var color = d3.scale.ordinal()
        .range(["#005824", "#238b45", "#66c2a4", "#ccece6"])
        .domain(["High income", "Upper middle income",
                 "Lower middle income", "Low income"]);

    // create x and y axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // make the svg fit the canvas
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // load json file and throw error if error is encountered
    d3.json("scatterplot.json", function(error, data) {
      if (error) throw error;

      // force data to numbers instead of strings
      data.forEach(function(d) {
        d.COtwo = +d.COtwo;
        d.GDP_growth = +d.GDP_growth
        d.GDP_total = +d.GDP_total;
      });


      x.domain(d3.extent(data, function(d) { return d.GDP_growth; })).nice();
      y.domain(d3.extent(data, function(d) { return d.COtwo; })).nice();
      z.domain(d3.extent(data, function(d) { return d.GDP_total; })).nice();

      // add title
      svg.append("text")
              .attr("x", 0)
              .attr("y", 0 - (margin.top / 2))
              .attr("text-anchor", "left")
              .style("font-size", "16px")
              .text("GDP growth compared to annual CO2 emmissions (2014)");

      // add subtitle
      svg.append("text")
              .attr("x", 0)
              .attr("y", 16 - (margin.top / 2))
              .attr("text-anchor", "left")
              .style("font-size", "16px")
              .text("Size represents country's GDP");

      // add x axis
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

      // add y axis
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

      // add dots
      svg.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", function(d) { return z(d.GDP_total); })
          .attr("cx", function(d) { return x(d.GDP_growth); })
          .attr("cy", function(d) { return y(d.COtwo); })
          .style("fill", function(d) { return color(d.income_category); });

      // add legend
      var legend = svg.selectAll(".legend")
          .data(color.domain())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) {
                                             return "translate(0," + i * 20 + ")";
                                            });

      // add colored rect to legend
      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      // add income category to legend
      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });

    });
}

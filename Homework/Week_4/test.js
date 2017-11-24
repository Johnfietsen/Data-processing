//
//  test.js
//
//  Author:   L.K. Stefelmanns
//  Course:   Data processing
//  Study:    Minor Programming, University of Amsterdam
//


var FONT = "Verdana",
    FONT_SIZE = 10,

    SPACE = 0.5 * FONT_SIZE,
    OFFSET = 1.1 * FONT_SIZE + SPACE,

    W_COLOR = FONT_SIZE,
    H_COLOR = 1.5 * FONT_SIZE,
    X_COLOR = FONT_SIZE,

    H_TEXT = H_COLOR
    X_TEXT = 9 * FONT_SIZE;

json = {"legend" : [
            {"color" : "#ccece6", "text" : "100"},
            {"color" : "#99d8c9", "text" : "1,000"},
            {"color" : "#66c2a4", "text" : "10,000"},
            {"color" : "#41ae76", "text" : "100,000"},
            {"color" : "#238b45", "text" : "1,000,000"},
            {"color" : "#005824", "text" : "10,000,000"},
            {"color" : "#d3d3d3", "text" : "Unknow Data"}]
       };


d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);

    d3.select("#Laag_1").selectAll(".st1").data(json.legend).enter()
        .append("rect")
        .attr("id", function(d, i) { return "kleur" + i; })
        .attr("class", "st1")
        .attr("x", X_COLOR)
        .attr("y", function(d, i) { return SPACE + i * (H_COLOR + SPACE); })
        .attr("width", W_COLOR)
        .attr("height", H_COLOR)
        .style("fill", function(d, i) { return json.legend[i].color; });

    d3.select("#Laag_1").selectAll(".st2").data(json.legend).enter()
        .append("text")
        .attr("id", function(d, i) { return "text" + i; })
        .attr("class", "st2")
        .attr("x", X_TEXT)
        .attr("y", function(d, i) { return OFFSET + i * (H_TEXT + SPACE); })
        .text(function(d, i) { return json.legend[i].text})
        .attr("font-family", FONT)
        .attr("font-size", FONT_SIZE)
        .attr("text-anchor", "end");
});

////////////////////////////////////////////////////////////////////////////////
//  test.js
//
//  Author:   L.K. Stefelmanns
//  Course:   Data processing
//  Study:    Minor Programming, University of Amsterdam
////////////////////////////////////////////////////////////////////////////////

rects = {"colors" : [
             {"id" : "kleur4", "y" : 138.7, "color" : "#ccece6"},
             {"id" : "kleur5", "y" : 180.6, "color" : "#99d8c9"},
             {"id" : "kleur6", "y" : 222.5, "color" : "#66c2a4"}],
         "numbers" : [
             {"id" : "tekst5", "y" : 180.6},
             {"id" : "tekst6", "y" : 222.5}
         ]
        };


d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);

    d3.select("#Laag_1").selectAll(".st1").data(rects.colors).enter()
        .append("rect")
        .attr("id", rects.colors.id)
        .attr("class", "st1")
        .attr("x", 13)
        .attr("y", rects.colors.y)
        .attr("width", 21)
        .attr("height", 29)
        .attr("fill", rects.colors.color);
});

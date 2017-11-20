////////////////////////////////////////////////////////////////////////////////
// test.js
//
// Author:   L.K. Stefelmanns
// Course:   Data processing
// Study:    Minor Programming, University of Amsterdam
//
////////////////////////////////////////////////////////////////////////////////

d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);
});

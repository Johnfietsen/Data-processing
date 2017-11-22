////////////////////////////////////////////////////////////////////////////////
//  scatterplot.js
//
//  Author:   L.K. Stefelmanns
//  Course:   Data processing
//  Study:    Minor Programming, University of Amsterdam
////////////////////////////////////////////////////////////////////////////////

//source: https://gist.github.com/iwek/7154706
function tsvJSON(tsv){

  var lines=tsv.split("\n");

  var result = [];

  var headers=lines[0].split("\t");

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split("\t");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }

	  result.push(obj);

  }

  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}


CO2_json = tsvJSON('../Datasets/CO2_emissions.tsv');

console.log(CO2_json);

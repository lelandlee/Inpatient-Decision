function drawLegend() {
	const colourKey = {
		"pink": "95% Confidence Interval of RAR",
		"black": "Linear Regression of RAR",
		"maroon": "Risk Adjusted Rate",
		"orange": "Observed Rate",
		"lightgreen": "Expected Rate",
		"#781F59": "NPS of Treatment",
		"#31AFAE": "NPS Overall"
	}
	var ordinal = d3.scale.ordinal()
		  .domain(_.map(colourKey, (description) => description))
		  .range(_.map(colourKey, (description, colour) => colour));

	var svg = d3.select('#legendArea').append("svg")
			.attr("width", 1500)
			.attr("height", 50);

	svg.append("g")
	  .attr("class", "legendOrdinal")
	  .attr("transform", "translate(20,20)");

	const legendOrdinal = d3.legend.color()
		  .shape('rect')
		  .shapeWidth(120)
		  .shapeHeight(5)
		  .shapePadding(110)
		  .orient('horizontal')
		  .labelAlign("start")
		  .scale(ordinal);

	svg.select(".legendOrdinal")
	  .call(legendOrdinal);
}
function generateSurveyViz(container, data) {
  const surveryInfo = hospitalSurveyMapScoped[data['Hospital Name']] || {};
  const surveryInfoOverall = hospitalSurveyMap[data['Hospital Name']];

  var surveryOpinion = container.append('svg')
    .attr("width", (height + margin.top + margin.bottom))
    .attr("height", (height + margin.top + margin.bottom) / 4)
    .style('margin-bottom', '30px')
    .style('float', 'right')
  .append("g")
    .attr("transform", "translate(" + margin.left/2 + "," + margin.top + ")");

  var xSurvery = d3.scale.linear()
    .domain([0, 10])
    .range([0, height]);
  var xAxisSurvery = d3.svg.axis()
    .scale(xSurvery)
    .orient("bottom");

  surveryOpinion.selectAll('rect')
      .data(_.concat(surveryInfo, surveryInfoOverall))
    .enter().append('rect')
      .attr("x", 0)
      .attr("width", (d) => _.has(d, 'mean') ? xSurvery(d['mean']) : 0)
      .attr("y", (d,i) => i*20)
      .style('fill', (d,i) => i === 0 ? '781F59': '31AFAE')
      .style("height", 18);

  surveryOpinion.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + 39 + ")")
      .call(xAxisSurvery)
    .append("text")
      .attr("x", 0)
      .attr("y", -60)
      .attr("dy", ".71em")
      .style("text-anchor", "front")
      .style('font-weight', 'bold')
      .text("NPS from People")
}
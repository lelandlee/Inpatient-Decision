function mainGraph(data, container, max) {
    var x = d3.time.scale()
      .domain([new Date(moment().year(2009).format()), new Date(moment().year(2014).format())])
      .range([0, width]);

  var y = d3.scale.linear()
      .domain([0, max])
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .tickFormat(d3.format(""))
      .orient("left");

  var line = (target) => {
    return d3.svg.line()
      .x((d) => x(new Date(moment().year(d['Year']).format())) || 0)
      .y((d) => y(d[target]) || 0);
  }

  var area = d3.svg.area()
      .x((d) => x(new Date(moment().year(d['Year']).format())))
      .y0((d) => y(d['Upper 95CI RAR']) || 0)
      .y1((d) => y(d['Lower 95CI RAR']) || 0);

  container.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("fill", 'pink')
      .attr("d", area);

  container.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line('Observed Rate'))
      .style('stroke', 'orange')

  container.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line('Expected Rate'))
      .style('stroke', 'lightgreen')

  container.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line('Risk Adjusted Rate'))
      .style('stroke', 'maroon')

  const _y = _.map(data, (d) => d['Risk Adjusted Rate']);
  const _x = _.map(data, (d) => d['Year']);
  const linReg = linearRegression(_y, _x);

  _.forEach(data, (d) => {
    d['linRegRAR'] = linReg['slope'] * d['Year'] + linReg['intercept'];
    d['Slope'] = linReg['slope'];
    d['R2'] = linReg['r2'];
  })
  container.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line('linRegRAR'))
      .style('stroke', 'black')
      .style('stroke-dasharray', '10,5')

  container.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  container.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -4)
      .attr("y", 9)
      .attr("dy", ".71em")
      .attr("text-anchor", "end")
      .text("Rate (per 1000)")
}
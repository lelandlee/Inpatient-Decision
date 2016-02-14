// Inspired from - http://bl.ocks.org/d3noob/473f0cf66196a008cf99
function tabulate(area, data, columns, style) {
  var table = area.append("table")
      .style(style);
  const thead = table.append("thead");
  const tbody = table.append("tbody");

	// append the header row
	thead.append("tr").selectAll("th")
      .data(columns)
      .enter()
	    .append("th")
			.text((column) => column);

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
      .data((row) => {
        return columns.map((column) => {
          return {column: column, value: d3.round(row[column],2)};
        });
      })
      .enter()
      .append("td")
      .html((d) => d.value);
    
    return table;
}
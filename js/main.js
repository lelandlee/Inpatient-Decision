const margin = {top: 40, right: 40, bottom: 40, left: 40};
const height = 400 - margin.top - margin.bottom;
const width = 960 - margin.left - margin.right;

var hospitalData = [];
var surveyData = [];
var hospitalSurveyMapScoped = {};
var hospitalSurveyMap = {};

document.querySelector('dialog').showModal();
drawLegend();
loadSurveyCSV();
loadHospitalCSV();

function loadSurveyCSV() {
	const path = 'data/Survey_Data.csv';
	d3.csv(path, (data) => {
		_.forEach(data, (d, i) => {
			/*
				Q2: "Which hospital did you visit"
				Q3 : "What were you treated for?"
				Q4_1 : "How would you rate the quality of your treatment (0 worst, 100 best)-Efficiency"
				Q4_2 : "How would you rate the quality of your treatment (0 worst, 100 best)-Comfort"
				Q4_3 : "How would you rate the quality of your treatment (0 worst, 100 best)-Overall Experience"
				Q5 : "On a scale from 0-10, how likely are you to recommend the hospital to a friend or colleague?"
			*/

			if (i !== 0) {
				d['Q4_1'] = parseInt(d['Q4_1'])
				d['Q4_2'] = parseInt(d['Q4_2'])
				d['Q4_3'] = parseInt(d['Q4_3'])
				d['Q5'] = parseInt(d['Q5'])
			}
		})
		surveyData = data;	
	})
}

function hospitalSurveryDataSpecificTreatment(name) {
	const surveyDataFiltered = _.filter(surveyData, (survey) => survey['Q3'] === name)

	hospitalSurveyMapScoped = generateMap(surveyDataFiltered)
	hospitalSurveyMap = generateMap(surveyData)

	function generateMap(data) {
		// Ought to map hospital names to IDs....but the marginal benefit is low

		const groupByHospital = _.groupBy(data, (survey) => survey['Q2']);
		const hospitalSurvey = _.map(groupByHospital, (hospital, i) => {
			return {
				mean:d3.mean(hospital, (s) => s['Q5']),
				std: d3.deviation(hospital, (s) => s['Q5'])
			}
		})
		const hospitalNames = _.map(groupByHospital, (hospital, i) => i);
		return _.zipObject(hospitalNames, hospitalSurvey);
	}
}

function loadHospitalCSV() {
	const path = 'data/All_Payer_Inpatient_Quality_Indicators__IQI__by_Hospital__SPARCS___Beginning_2009.csv';
	d3.csv(path, (data) => {
		_.forEach(data, (d) => {
			d['Year'] = parseFloat(d['Year'])
			d['Expected Rate'] = parseFloat(d['Expected Rate'])
			d['Risk Adjusted Rate'] = parseFloat(d['Risk Adjusted Rate'])
			d['Upper 95CI RAR'] = parseFloat(d['Upper 95CI RAR'])
			d['Total Cases'] = parseFloat(d['Total Cases'])
			d['Observed Rate'] = parseFloat(d['Observed Rate'])
			d['Numerator'] = parseFloat(d['Numerator'])
			d['Facility ID'] = parseFloat(d['Facility ID'])
			d['Lower 95CI RAR'] = parseFloat(d['Lower 95CI RAR'])
		})
		hospitalData = data;

		const optionsFiltered = _.filter(hospitalData, (d) => validHospital(d) && d['Year'] === 2014)
		const possibleIQI = _.uniq(_.map(optionsFiltered, (hospital) => hospital['IQI Value']));
		populateIQIs(possibleIQI);

    document.querySelector('#seach-query').value = "Heart Failure Mortality Rate";
		search("Heart Failure Mortality Rate")
	})
}

function search(name) {
	const IQI_value = name || document.querySelector('#seach-query').value;

	removeOldContent(document.getElementById('chartArea'));

	hospitalSurveryDataSpecificTreatment(IQI_value);
	searchFor(IQI_value);
}

function validHospital(d) {
	return d['Hospital Name'] !== 'National' && d['Hospital Name'] !== 'Statewide';
}

function searchFor(IQI_value) {
	const selectedUnGrouped = _.filter(hospitalData, (d) => {
		return d['IQI Value'] === IQI_value && validHospital(d);
	})
	const groupedUnfiltered = _.groupBy(selectedUnGrouped, (d) => d['Facility ID'])
	const groupFiltered = _.filter(groupedUnfiltered, (d) => d3.max(d, (h) => h['Year']) === 2014)

	// Return sorted by highest happiness, ought to filter if there is not enough data points or allow the user to do it
	const groupedRatingAscending = _.sortBy(groupFiltered, (group) => {
		const mostRecent = _.max(group, (d) => d['Year']);

		// Might want to consider a specific type of algorithm to run here...
		const val = mostRecent['Risk Adjusted Rate'] || mostRecent['Observed Rate'];
		return !_.isNaN(val) ? -val : Infinity;
	})

	// Taking the top 5
	const top5 = _.take(groupedRatingAscending, 5);
	const max = d3.max(top5, (hospital) => d3.max(hospital, (d) => d['Upper 95CI RAR'])) || 1000
	_.forEach(top5, (hospital) => visualization(hospital, max))
}

function visualization(data, max) {
  var content = d3.select("#chartArea").append("div").attr('class', 'hospital')
  var svg = content.append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  mainGraph(data, svg, max)

  const meta = _.first(data);
  svg.append('text')
  		.style('font-weight', 'bold')
    	.attr("x", 30)
      .attr("dy", ".71em")
      .text(meta['Hospital Name'] + ', ' + meta['Hospital Region'])

  const tableStyle = {
  	'display': 'inline-block',
    'margin-top': margin.top + 'px',
    'vertical-align': 'top'
  }
  var rightContainer = content.append('div')
  	  .style('display', 'inline-block')
      .style('vertical-align', 'top');
  tabulate(rightContainer, data, ['Year', 'Risk Adjusted Rate', 'Observed Rate', 'Total Cases'], tableStyle)

  rightContainer.append('br')

  generateSurveyViz(rightContainer, meta)

  const table2style = {
    'margin-top': '20px',
    'vertical-align': 'top'
  }

  tabulate(rightContainer, [_.first(data)], ['Slope', 'R2'], table2style)
}

function populateIQIs(IQIs) {
	var dataList = document.querySelector('#IQI_values');
	IQIs = _.sortBy(IQIs, (IQI) => IQI)
	_.forEach(IQIs, (IQI) => {
		var option = document.createElement('option');
		option.value = IQI
		dataList.appendChild(option)
	})
}

//This is to close the modal when clicking outside of it
document.querySelector('#modal').addEventListener('click', (e) => {
	if (e.target.id === "modal") {
		document.getElementById("modal").close();
	}
})

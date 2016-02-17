# How to choose a hospital for treatment? -> Inpatient Decision

This web app allows consumers to explore potential hospitals to visit when they must undergo a specific procedure. The hospitals are ranked by a relatively simple algorithm that uses features such as Risk Adjusted Rate (RAR) of the Inpatient Quality Indicators, patients who have already undergone that procedure at the same hospital, variance of RAR, etc.

This was created at TreeHacks 2016 (a hackathon at Stanford University). A live version is located [here](https://lelandlee.github.io/Inpatient-Decision)

### The Benefit
The problem is that consumers do not have an easy way to determine the quality of inpatient care at hospitals beyond knowing that a hospital has a specific treatment. Now with this tool consumers can explore different hospitals and see how they stack up in quality of care for different medical procedures.

### Technology Used
* Using [Qualtrics](www.qualtrics.com) for consumer feedback which helps feed the model.
* Dataset is from New York State's Health data, specifically [All Payer Inpatient Quality Indicators (IQI) by Hospital (SPARCS)](https://health.data.ny.gov/Health/All-Payer-Inpatient-Quality-Indicators-IQI-by-Hosp/xyfc-qbbr).
* D3.js for data visualisations and d3-legend.
* Code is written in a mix of ES6 and ES5, and the code will not work for non modern browsers.

### Future Iterations
* Use more advance modeling methods determine which hospital has a higher level of inpatient quality, and test those features, rather than educated guesses on features and their weights.
* Add a spatial component to show where hospitals are located relative to each other and to check for interesting patterns.
* Leverage the complete dataset that we have.
* Make dimensions scaling friendly.
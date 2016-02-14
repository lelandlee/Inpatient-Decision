# Ideation + Notes

TreeHacks Health: Best Big Data Hack - Sponsored by Oscar Health
23andMe Kits for the team

Favorite Use of Data Visualization - Sponsored by Illumio
Syma Explorer Quadcopters for the team

Best Use of Data Visualization - Sponsored by Qualtrics
Choice of Snowboard, Longboard or Mountain Bike for each team member.


-Use Qualtrics to generate a survey about hospitals + IQI case + how was the experience


How it will work: Hospital side vs Patient Side
* Select a hospital
* And select a disease?
* Will be a pie chart showing the break up of treatement + compare to the average?
* Time series of the treatment + SD + overlayed with people sentiment towards the treatment

## Patient Side -> Want to allow them to make better choices on choosing hospitals
* Select a disease
* Show top hospitals with the highest RAR (sort by avg or current year or NPS for given operation). Should the end user have their own filters?
* When display hospitals show different metrics
* Have user review too about the hospital -> the data (not API, via table)

#### Column Definitions
Numerator - # of cases that fit IQI
Observed Rate - Rate of cases that fit IQI (per 1000)
Expected Rate - Rate of cases that fit IQI adjusted for covariance (per 1000)
Risk Adjusted Rate - Rate of cases that fit IQI adjusted for risk of operation (per 1000)


Goal is to find a hospital that has the highest RAR for an operation.
What does it mean when the delta between RAR & Observed Rate is large?

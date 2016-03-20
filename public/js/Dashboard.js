var q = queue();
q.defer(d3.json, "/api/data");
q.await(renderPlots);  //Using d3 queue , defer a task and then await a callback

function renderPlots(error, apiData) {
	
//Start Transformations
	var data = apiData;
	var dateFormat = d3.time.format("%m/%d/%Y"); //parse 
	data.forEach(function(d) {
		d.date_posted = dateFormat.parse(d.date_posted); //parse each value in database as per dateFormat
		d.date_posted.setDate(1);
		d.total_donations = +d.total_donations;
	});

	//Create a Crossfilter instance
	var db = crossfilter(data);

	//Define Dimensions on which the operations will be performed
	var datePosted = db.dimension(function(d) { return d.date_posted; });
	var resourceType = db.dimension(function(d) { return d.resource_type; });
	var fundingStatus = db.dimension(function(d) { return d.funding_status; });
	var state = db.dimension(function(d) { return d.school_state; });
	var totalDonations  = db.dimension(function(d) { return d.total_donations; });


	//Group the data values in the corresponding dimensions
	var projectsByDate = datePosted.group(); 
	var projectsByResourceType = resourceType.group();
	var projectsByFundingStatus = fundingStatus.group();
	var stateGroup = state.group();
 
	var all = db.groupAll();  //All records in a single group

	//Calculate the sum of donations in state dimension
	var totalDonationsState = state.group().reduceSum(function(d) {
		return d.total_donations;
	});
	//Count values corresponding to funding status
	var totalDonationsFundingStatus = fundingStatus.group().reduceSum(function(d) {
		return d.funding_status;
	});



	var netTotalDonations = db.groupAll().reduceSum(function(d) {return d.total_donations;});

	//Define threshold values for data
	var minDate = datePosted.bottom(1)[0].date_posted;
	var maxDate = datePosted.top(1)[0].date_posted;

    //Charts whose id are mentioned in index.html
	var dateChart = dc.lineChart("#date-chart");
	var resourceTypeChart = dc.rowChart("#resource-chart");
	var fundingStatusChart = dc.pieChart("#funding-chart");
	var totalProjects = dc.numberDisplay("#total-projects");
	var netDonations = dc.numberDisplay("#net-donations");
	var stateDonations = dc.barChart("#state-donations");


  selectField = dc.selectMenu('#menuselect')
        .dimension(state) //Only the state which is selected is taken into dimension consideration
        .group(stateGroup); 

       dc.dataCount("#row-selection")
        .dimension(db) //Entire database is considered beacuse it returns the number of rows matching the filter values
        .group(all);

    // Set the stats of various garphs and charts
	totalProjects
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	netDonations
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(netTotalDonations)
		.formatNumber(d3.format(".5s")); //Decimal accuracy

	dateChart
		.height(220)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(datePosted)
		.group(projectsByDate)
		.colors( ['teal'] )
		.renderArea(true)
		.transitionDuration(400)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.renderHorizontalGridLines(true)
    	.renderVerticalGridLines(true)
		.xAxisLabel("Year")
		.yAxis().ticks(6);

	resourceTypeChart
        .height(220)
        .dimension(resourceType)
        .group(projectsByResourceType)
        .elasticX(true)
        .xAxis().ticks(5);



  
    fundingStatusChart
        .height(220)
        .radius(100)
        .innerRadius(20)
        .colors(d3.scale.ordinal().range(
  [ 'teal', '#b2df8a', '#cab2d6']))
        .transitionDuration(500)
        .dimension(fundingStatus)
        .group(projectsByFundingStatus);


    stateDonations
        .height(220)
        .transitionDuration(1000)
        .dimension(state)
        .group(totalDonationsState)
        .colors( ['teal'] )
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .centerBar(false)
        .gap(5)
        .elasticY(true)
        .x(d3.scale.ordinal().domain(state))
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .ordering(function(d){return d.value;})
        .yAxis().tickFormat(d3.format(".1s"));

	dc.renderAll(); //Render them all

};
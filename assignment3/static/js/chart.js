queue()
    .defer(d3.json, "/state_chart?years=2016&states=all&months=all&wcs=all&severity=all&ss=all")
    .defer(d3.json, "/monthly_accidents_chart?years=2016&states=all&months=all&wcs=all&severity=all&ss=all") 
    .defer(d3.json, "/day_night_chart?years=2016&states=all&months=all&wcs=all&severity=all&ss=all") 
    .defer(d3.json, "/severity_chart?years=2016&states=all&months=all&wcs=all&severity=all&ss=all")
    .defer(d3.json, "/weather_condition_chart?years=2016&states=all&months=all&wcs=all&severity=all&ss=all")
    .defer(d3.json, "/static/geojson/us-states.json")
    .await(makeGraphs);
  

var parseDate = d3.time.format("%Y-%m-%d").parse;
var monthlyAccidentChart = dc.barChart('#monthly-accidents-chart');
var stateChart = dc.geoChoroplethChart("#state-chart");
var severityChart = dc.rowChart('#severity-chart');
var weatherChart = dc.rowChart('#weather-chart');
var dayNightChart = dc.pieChart('#day-night-chart');
var numberProjectsND = dc.numberDisplay("#number-projects-nd");

  function makeGraphs(error, chart1Json, chart2Json,chart3Json,chart4Json, chart5Json,statesJson) {
    // crossfilter
    var data1; 
    var data2; 
    var data3; 
    var data4; 
    var data5;
    var stateData = chart1Json;
    var monthData = chart2Json;
    var dayNightData  = chart3Json;
    var severityData = chart4Json;
    var weatherData = chart5Json;


    function removeAllFilters(){
      weatherChart.filterAll();
      severityChart.filterAll();
      stateChart.filterAll();
      dayNightChart.filterAll();
      numberProjectsND.filterAll();
      monthlyAccidentChart.filterAll();
      
    }

    

      d3.selectAll(".filter_button").on("change",update);

      function update(){
          var yearsSelected=[];
          var checkboxSelected = d3.selectAll('input[type=checkbox]:checked');
          //console.log(checkboxSelected.length);
          for (var i=0; i<checkboxSelected[0].length;i++){
              yearsSelected.push(checkboxSelected[0][i].value);
            }

          var years = yearsSelected;
          var years_filter = years==""? 'all': years.join('&years=');  
          window.history.pushState(null, "US Accidents Analysis", "/years="+years_filter+"&states=all&months=all&wcs=all&severity=all&ss=all");
          console.log(Date.now(), "/years="+years_filter+"&states=all&months=all&wcs=all&severity=all&ss=all");
           (async () => {var data;
            async function getData(url) { 
              return fetch(url).then(
              function(u){ return u.json();}
                ).then(
              function(json){
                data = json;
                })    
            }

            removeAllFilters();
            await getData("http://localhost:8080/state_chart?years="+years_filter+"&states=all&months=all&wcs=all&severity=all&ss=all"); 
            //console.log(data);
            data1 = data;
            await getData("http://localhost:8080/monthly_accidents_chart?years="+years_filter+"&states=all&months=all&wcs=all&severity=all&ss=all");
            data2 = data;
            await getData("http://localhost:8080/day_night_chart?years="+years_filter+"&states=all&months=all&wcs=all&severity=all&ss=all");
            data3 = data;
            await getData("http://localhost:8080/severity_chart?years="+years_filter+"&states=all&months=all&wcs=all&severity=all&ss=all");
            data4 = data;
            await getData("http://localhost:8080/weather_condition_chart?years="+years_filter+"&states=all&months=all&wcs=all&severity=all&ss=all");
            data5 = data;
            //console.log(data2);
            await drawCrossFilter(data1,data2, data3, data4, data5, yearsSelected);
          })();

        }

        
        d3.selectAll(".filter").on("DOMSubtreeModified", update_all);
        
        function clean_data(constraint){
            var new_constraint = [];
            for( var i=0; i<constraint.length; i++){
                new_constraint.push(constraint[i].trim());
            }
            return new_constraint;
        }

        function update_all(){
          
          var yearsSelected=[];
          var checkboxSelected = d3.selectAll('input[type=checkbox]:checked');
          //console.log(checkboxSelected.length);
          for (var i=0; i<checkboxSelected[0].length;i++){
              yearsSelected.push(checkboxSelected[0][i].value);
            }

          var filter_applied = d3.selectAll('.filter')[0];
          var states = filter_applied[0].innerText;
          var ss = filter_applied[1].innerText;
          var months = filter_applied[2].innerText;
          var severity = filter_applied[3].innerText;
          var wcs = filter_applied[4].innerText;

          //console.log(states,ss,months,severity,wcs);
          
          states = clean_data(states.trim().split(','));
          months = clean_data(months.trim().split(','));
          wcs = clean_data(wcs.trim().split(','));
          ss = clean_data(ss.trim().split(','));
          severity = clean_data(severity.trim().split(','));
          years = yearsSelected;
        

          var states_filter = states==""? '&states=all': '&states=' + states.join('&states=');
          var months_filter = months==""? '&months=all': '&months=' + months.join('&months=');
          var wcs_filter = wcs==""? '&wcs=all': '&wcs=' + wcs.join('&wcs=');
          var severity_filter = severity==""? '&severity=all': '&severity=' + severity.join('&severity=');
          var ss_filter = ss==""? '&ss=all': '&ss=' + ss.join('&ss=');
          var years_filter = years==""? 'all': years.join('&years=');
          
          //console.log(states_filter+months_filter+wcs_filter+severity_filter+ss_filter)

          window.history.pushState(null, "US Accidents Analysis", "/years="+years_filter+states_filter+months_filter+wcs_filter+severity_filter+ss_filter);
          console.log(Date.now(), "/years="+years_filter+states_filter+months_filter+wcs_filter+severity_filter+ss_filter);
          
          (async () => {var data;
            async function getData(url) { 
              return fetch(url+years_filter+states_filter+months_filter+wcs_filter+severity_filter+ss_filter).then(
            function(u){ return u.json();}
              ).then(
            function(json){
              data = json;
            })    
          }

            await getData("http://localhost:8080/state_chart?years="); 
            //console.log(data);
            data1 = data;
            await getData("http://localhost:8080/monthly_accidents_chart?years=");
            data2 = data;
            await getData("http://localhost:8080/day_night_chart?years=");
            data3 = data;
            await getData("http://localhost:8080/severity_chart?years=");
            data4 = data;
            await getData("http://localhost:8080/weather_condition_chart?years=");
            data5 = data;
            //console.log(data2);
            await drawCrossFilter(data1,data2, data3, data4, data5, yearsSelected, ss_filter);
          })();          

        }    
          
        
        drawCrossFilter(stateData, monthData, dayNightData, severityData, weatherData);
    


    function drawCrossFilter(stateData, monthData, dayNightData, severityData, weatherData, yearsSelected=['2016'], ss_filter='all') {


        
        //console.log(severityData);
        //console.log(weatherData);
        //console.log(stateData);
        //console.log(dayNightData);
        //console.log(monthData);

      monthData.forEach(function(d, i) {
        d.index = i;
        d.date = parseDate(d[0]);//parseDate(d.st);
        d.value = +d[1];//+d.sev;
        d.year = d.date.getFullYear();
      });


      stateData.forEach(function(d, i) {
        d.index = i;
        d.state = d[0];
        d.value = +d[1];//+d.sev;
      });
       

      dayNightData.forEach(function(d,i) {
          d.index = i;
          d.sunrise_sunset = d[0];
          d.value = +d[1];
      })

      weatherData.forEach(function(d,i) {
          d.index = i;
          d.weather_condition = d[0];
          d.value = +d[1];
      })

      severityData.forEach(function(d,i) {
          d.index = i;
          d.severity = +d[0];
          d.value = +d[1];
      })



      // Various formatters.
      var formatNumber = d3.format(",d"),
          formatChange = d3.format("+,d"),
          formatDate = d3.time.format("%B %d, %Y"),
          formatTime = d3.time.format("%I:%M %p");
      


      var stateCrossFilter = crossfilter(stateData);
      var monthCrossFilter = crossfilter(monthData);
      var dayNightCrossFilter = crossfilter(dayNightData);
      var severityCrossFilter = crossfilter(severityData);
      var weatherCrossFilter = crossfilter(weatherData);





      var stateDimension = stateCrossFilter.dimension(function (d) { return d.state; });
      var monthlyAccidentDimension = monthCrossFilter.dimension(function (d) {return d.date; });
      var dayNightDimension = dayNightCrossFilter.dimension(function (d) { return d.sunrise_sunset; });
      var severityDimension = severityCrossFilter.dimension(function (d) { return d.severity; });
      var weatherDimension = weatherCrossFilter.dimension(function (d) { return d.weather_condition; });


        function getTops(source_group) {
            return {
                all: function () {
                    return source_group.top(10);
                }
            };
        }
      

      var stateDimensionGroup = stateDimension.group().reduceSum(function (d) {return d.value;});
      var severityDimensionGroup = severityDimension.group().reduceSum(function (d) {return d.value;});
      var weatherDimensionGroup = weatherDimension.group().reduceSum(function (d) {return d.value;});
      var fakeWeatherDimensionGroup = getTops(weatherDimensionGroup);
      var monthlyAccidentDimensionGroup = monthlyAccidentDimension.group(d3.time.month).reduceSum(function (d) {return d.value;});
      var dayNightDimensionGroup = dayNightDimension.group().reduceSum(function (d) {return d.value;});



      //Define values (to be used in charts)
      yearsSelected.forEach(function(d, i) {return parseInt(d);});
      var minYear = Math.min(yearsSelected);
      var maxYear = Math.max(yearsSelected);
      var max_state = stateData.length > 0? stateDimensionGroup.top(1)[0].value : 0;
      var months = ['January', 'February', 'March', 'April','May', 'June', 'July','August','September', 'October', 'November','December'];
      var all = dayNightCrossFilter.groupAll().reduceSum(function(d){
        if (ss_filter.includes('all') || (ss_filter.includes('Day') && ss_filter.includes('Night'))){
          return d.value}
        else if (ss_filter.includes('Day') && d.sunrise_sunset=='Day'){ 
            return d.value;
        }
        else if (ss_filter.includes('Night') && d.sunrise_sunset=='Night'){ 
            return d.value;
        }
        else{return 0;} });
      //console.log(all.value());

    // Functions to add x-label & y-label to Row Charts (Unsupported by dc.js)
      var addXLabel = function(chartToUpdate, displayText) {
        var textSelection = chartToUpdate.svg().append("text")
                    .attr("class", "x-axis-label")
                    .attr("text-anchor", "middle")
                    .attr("style","font:12px sans-serif;")
                    .attr("x", chartToUpdate.width() / 2)
                    .attr("y", chartToUpdate.height() - 10)
                    .text(displayText);
        var textDims = textSelection.node().getBBox();
        var chartMargins = chartToUpdate.margins();
     
        // Dynamically adjust positioning after reading text dimension from DOM
        textSelection
            .attr("x", chartMargins.left + (chartToUpdate.width()
              - chartMargins.left - chartMargins.right) / 2)
            .attr("y", chartToUpdate.height() - Math.ceil(textDims.height) +40/ 2);
      };
      var addYLabel = function(chartToUpdate, displayText) {
        var textSelection = chartToUpdate.svg().append("text")
                    .attr("class", "y-axis-label")
                    .attr("style","font: 12px sans-serif;")
                    .attr("text-anchor", "middle")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -chartToUpdate.height() / 2)
                    .attr("y", 10)
                    .text(displayText);
        var textDims = textSelection.node().getBBox();
        var chartMargins = chartToUpdate.margins();
     
        // Dynamically adjust positioning after reading text dimension from DOM
        textSelection
            .attr("x", -chartMargins.top - (chartToUpdate.height()
              - chartMargins.top - chartMargins.bottom) / 2)
            .attr("y", Math.max(Math.ceil(textDims.height), chartMargins.left
              - Math.ceil(textDims.height) - 5));
      };

      

      severityChart
        .width(250)
        .height(180)
        .transitionDuration(100)
        .dimension(severityDimension)
        .group(severityDimensionGroup)
        .elasticX(true)
        .colors(d3.scale.ordinal()
             .domain(["1", "2", "3", "4"])
             .range(["#c6dbef","#9ecae1", "#6baed6" , "#3182bd"]))
        .margins({top: 10, left: 10, right: 10, bottom: 20})  
        .label(function (d) {
              return d.key;
        })
        // Title sets the row text
        .title(function (d) {
              return d.value;
        })
        .xAxis().ticks(4);

      

      weatherChart
        .width(300)
        .height(400)
        .transitionDuration(100)
        .dimension(weatherDimension)
        .colors(d3.scale.category10())
        .group(fakeWeatherDimensionGroup)
        .elasticX(true)
        .margins({top: 10, left: 10, right: 10, bottom: 20})  
        .label(function (d) {
              return d.key;
        })
        // Title sets the row text
        .title(function (d) {
              return d.value;
        })
        .xAxis().ticks(5);




      stateChart.width(700)
        .height(320)
        .dimension(stateDimension)
        .transitionDuration(100)
        .group(stateDimensionGroup)
        .linearColors(['#d5ebf7','#3182bd'])
        .colorCalculator(function(d){ return d ? stateChart.colors()(d) : '#ccc'; })
        .colorDomain([0, max_state])
        .overlayGeoJson(statesJson["features"], "state", function (d) {
          return d.properties.name;
        })
        .projection(d3.geo.albersUsa()
                .scale(600)
                .translate([340, 150]))
        .title(function (p) {
          return "State: " + p["key"]
              + "\n"
              + "Total Accidents: " + Math.round(p["value"]);
        });


      monthlyAccidentChart 
        .width(680)
        .height(250)
        .margins({top: 30, right: 50, bottom: 25, left: 40})
        .dimension(monthlyAccidentDimension)
        .group(monthlyAccidentDimensionGroup)
        .elasticY(true)
        .brushOn(true)
        .elasticX(true)
        .centerBar(true)
        .transitionDuration(100)
        // (_optional_) set gap between bars manually in px, `default=2`
        .gap(1)
        .barPadding(0.1)
        .outerPadding(1)
        // (_optional_) set filter brush rounding
        .alwaysUseRounding(true)
        .xAxisPadding(1).xAxisPaddingUnit('month')
        //.yAxisLabel('Number of Accidents')
        //.xAxisLabel('Month')
        .x(d3.time.scale().domain([new Date(minYear, 0, 1), new Date(maxYear, 11, 31)]))
        .round(d3.time.month.round)
        .xUnits(d3.time.months)
        .renderHorizontalGridLines(true)
        .title(function (p) {
          return "Month: " + p["key"]
              + "\n"
              + "Total Accidents: " + Math.round(p["value"]);
        })
        .transitionDuration(100)
        // Customize the filter displayed in the control span
        .filterPrinter(function (filters) {
            var filter = filters[0], s = '';
            s += months[filter[0].getMonth()] +' '+ filter[0].getFullYear()+ ' -> ' + months[filter[1].getMonth()]+' '+filter[1].getFullYear();
            return s;
        });

      monthlyAccidentChart.yAxis().ticks(5);
   
        
      /*day vs night pie chart*/
     dayNightChart 
      .width(230)
      .height(180)
      .radius(80)
      .drawPaths(true)
      .transitionDuration(100)
      .cx(90)
      .cy(90)
      .dimension(dayNightDimension)
      .group(dayNightDimensionGroup)
      .label(function (d) {
        if (dayNightChart.hasFilter() && !dayNightChart.hasFilter(d.key)) {
            return d.key + '(0%)';
        }
        var label = d.key;
        if (all.value()) {
            label += '(' + (d.value / all.value() * 100).toFixed(2)+ '%)';
        }
        return label;
        });
      



      /* number of accidents */
      numberProjectsND
        .formatNumber(d3.format("d"))
        .transitionDuration(100)
        .valueAccessor(function(d){return d; })
        .group(all);

      stateChart.render();
      monthlyAccidentChart.render();
      numberProjectsND.render();
      dayNightChart.render();
      severityChart.render();
      weatherChart.render();

      //addYLabel(severityChart,"Severity level");
      //addXLabel(severityChart,"Number of Accidents");
      //addYLabel(weatherChart,"Weather Conditions");
      //addXLabel(weatherChart,"Number of Accidents");

};
  };
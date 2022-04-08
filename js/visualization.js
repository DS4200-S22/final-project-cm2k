
/*
Unfortunately, we've tried for several hours to get our actual data to work,
but it still does not. We have been to office hours a few times, and have also
played around with rollups and grouping for some time, but it still doesn't work.

All other aspects of our graphs should work once we are able to solve the grouping
issues we are having. 
*/


// Set dimensions and margins for plots 
const width = 1200; 
const height = 450; 
const margin = {left:50, right:50, bottom:50, top:50}; 
const yTooltipOffset = 15; 

// Creates an svg window for the bar chart
const svg1 = d3
  .select("#vis-container")
  .append("svg")
  .attr("width", width-margin.left-margin.right)
  .attr("height", height - margin.top - margin.bottom)
  .attr("viewBox", [0, 0, width, height]);

const format = d3.timeFormat("%b %d, %Y");
const parser = d3.timeParse("%Y-%m-%d");

// data/us-state-covid-abbr.csv
// https://raw.githubusercontent.com/DS4200-S22/final-project-cm2k/main/data/us-state-covid-abbr.csv
d3.csv('https://raw.githubusercontent.com/DS4200-S22/final-project-cm2k/main/data/us-state-covid-abbr.csv',
function(d){
        return {
            date : new Date(format(parser(d.date))),
            state : d.state,
            cases : +d.cases,
            deaths : +d.deaths,
            abbr_state : d.abbr_state
        };
    }).then(function(data) {

// passing in data but not specifying specific column you want to print out

var test = d3.rollup(data, v => d3.sum(v, d => +d.cases), d => d.state)
var format = d3.timeFormat("%b %d, %Y");
var parser = d3.timeParse("%Y-%m-%d")

// hard code data
const d1 = [{date: "2020-01-21", cases:8500000},
{date: "2020-01-22", cases:4200000}, {date: "2020-01-23", cases:6900000},
{date: "2020-01-24", cases:6500000}, {date: "2020-01-25", cases:7654321},
{date: "2020-01-26", cases:8765432}, {date: "2020-01-27", cases:6666666},
{date: "2020-01-28", cases:7172002}, {date: "2020-01-29", cases:8500000},
{date: "2020-01-30", cases:4200000}]

// we want to find the sum of one column's values based on another column's values
// filter between cases and deaths - our data 

xKey1 = "date";
yKey1 = "cases";

let minY1 = 0;
let maxY1 = d3.max(d1, function(d) { return d.cases; });
// let maxY1 = d3.max(wash, function(d) { return d.cases; });
// let maxY1 = Math.max(...test.values());

const dates = new Set(data.map(d => d.date))
const dateArray = Array.from(dates)

let xScale1 = d3.scaleBand()
            .domain(d3.range(10))
            .range([margin.left, width - margin.right])
            .padding(0.1);

// let xScale1 = d3.scaleTime()
//             .domain(d3.extent(dateArray))
//             .range([margin.left, width - margin.right]);
            
let yScale1 = d3.scaleLinear()
            .domain([minY1,maxY1])
            .range([height-margin.bottom,margin.top]); 

// y-axis markings
svg1.append("g")
   .attr("transform", `translate(${margin.left}, 0)`) 
   .call(d3.axisLeft(yScale1)) 
   .attr("font-size", '20px')
   // Add y-axis label
   .call((g) => g.append("text")
   .attr("x", 0)
   .attr("y", margin.top - 20)
   .attr("fill", "black")
   .attr("text-anchor", "end")
   .text(yKey1)
   ); 

// x-axis markings
svg1.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`) 
    .call(d3.axisBottom(xScale1)
            .tickFormat(i => d1[i][xKey1]))
            //.tickFormat(format))
    .attr("font-size", '10px')
      // Add x-axis label
      .call((g) => g.append("text")
      .attr("font-size", '20px')
      .attr("x", width - margin.right)
      .attr("y", margin.bottom - 4)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .text(xKey1) 
      );
    
    
// Tooltip setup starts

// creates the tooltip
const tooltip1 = d3.select("#vis-container") 
                .append("div") 
                .attr('id', "tooltip1") 
                .style("opacity", 0) 
                .attr("class", "tooltip"); 

// Creates an information pop up when a user hovers over each bar with information
// about that bar 
const mouseover1 = function(event, d) {
  tooltip1.html("Total cases: " + d.cases + "<br> Total deaths: " + d.deaths + "<br>") 
          .style("opacity", 1);  
}

// Moves the information pop up to where the mouse moves.
const mousemove1 = function(event, d) {
  tooltip1.style("left", (event.x)+"px") 
          .style("top", (event.y + yTooltipOffset) +"px"); 
}

// When the mouse is not hovering a bar, the pop up disappears.
const mouseleave1 = function(event, d) { 
  tooltip1.style("opacity", 0); 
}

// homework 5 - flower column
// passing in too much data - need to be specific
// might be able to pass in keys on column header
svg1.selectAll(".bar")
  .data(d1)
  .enter()
  .append("rect") 
  .attr("class", "bar") 
  .attr("x", (d, i) => xScale1(i)) 
  .attr("y", (d) => yScale1(d[yKey1])) 
  // .attr("x", function(wash) {return xScale1(format(wash.date))})
  // .attr("y", function(wash) { return yScale1(wash.cases); })
  // .attr("x", (wash, i) => xScale1(format(i[xKey1])))
  // .attr("y", function(wash) { return yScale1(wash.cases); })
  .attr("height", (d) => (height - margin.bottom) - yScale1(d[yKey1]))
  .attr("width", 100)
  .on("mouseover", mouseover1) 
  .on("mousemove", mousemove1)
  .on("mouseleave", mouseleave1);

// line graph starts
const svg2 = d3
  .select("#vis-container")
  .append("svg")
  .attr("width", width-margin.left-margin.right)
  .attr("height", height - margin.top - margin.bottom)
  .attr("viewBox", [0, 0, width, height]);

// drop-down menu for line graph
const states = new Set(data.map(d => d.state)) // can't get cases and deaths to show up for some reason
const stateArray = Array.from(states)

d3.select('#selectButton')
.selectAll('myOptions')
.data(stateArray.sort(function (a, b) {
  return a.localeCompare(b); 
}))
.enter()
.append('option')
.text(function(d) {return d;})
.attr('value', function(d) {return d;})

var colorLine = d3.scaleOrdinal()
                  .domain(states)
                  .range(d3.schemeSet2);

// x-axis
let xScale2 = d3.scaleBand()
            .domain(d3.range(10))
            .range([margin.left, width - margin.right])
            .padding(0.1);

// y-axis
let yScale2 = d3.scaleLinear()
            .domain([minY1,maxY1])
            .range([height-margin.bottom,margin.top]); 


svg2.append("g")
   .attr("transform", `translate(${margin.left}, 0)`)  
   .call(d3.axisLeft(yScale2)) 
   .attr("font-size", '20px')
   //Add y-axis label
   .call((g) => g.append("text")
   .attr("x", 0)
   .attr("y", margin.top - 20)
   .attr("fill", "black")
   .attr("text-anchor", "end")
   .text(yKey1)
   ); 


svg2.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`) 
    .call(d3.axisBottom(xScale2)
    .tickFormat(i => d1[i][xKey1]))
    .attr("font-size", '20px')
    //Adding x-axis label
      .call((g) => g.append("text")
      .attr("x", width - margin.right)
      .attr("y", margin.bottom - 4)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .text(xKey1) 
      );

let line = d3.line()
              .x((d, i) => xScale1(i))
              .y((d) => yScale1(d[yKey1]))
        //       .datum(data.filter(function(d) {return d.cases}))
        //       .attr("d", d3.line()
        //       .x(function(d) {return x(d.year)})
        //       .y(function(d) {return y(+d.n)}))
        //       .attr("stroke", function(d){ return myColor("valueA") })
        // .style("stroke-width", 4)
        // .style("fill", "none")
              

svg2.append("path")
    .datum(d1)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("transform", "translate(" + 60 + "," + 60 + ")")
    .attr("d", line);

// update the selection
function update(selectedGroup) {
  const dataFiltered = data.filter(function(d) {return d.cases == selectedGroup})
  line.datum(dataFiltered)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d) {return x(d.date)})
        .y(function (d) {return y(+d.n)})
      )
      .attr("stroke", function(d) {return myColor(selectedGroup)})
}

d3.select('#selectButton').on("change", function(event,d) {
  const selectedOption = d3.select(this).property("value")
  update(selectedOption)
})



// chloropleth -----------------------------------------

  // hard code data
const tempMapData = [{state_abbr: "MA", cases:100},
                        {state_abbr: "PA", cases:1000}, 
                        {state_abbr: "AZ", cases:50},
                        {state_abbr: "NY", cases:10000}, 
                        {state_abbr: "CA", cases:4566},
                        {state_abbr: "NJ", cases:23458}, 
                        {state_abbr: "OH", cases:8567},
                        {state_abbr: "MN", cases:3456}, 
                        {state_abbr: "TX", cases:76345},
                        {state_abbr: "AK", cases:2}, 
                        {state_abbr: "WV", cases:4523},
                        {state_abbr: "VT", cases:98765}]

  const svg3 = d3
    .select("#vis-container")
    .append("svg")
    .attr("width", width-margin.left-margin.right)
    .attr("height", height - margin.top - margin.bottom)
    .attr("viewBox", [0, 0, width, height]);

    const path = d3.geoPath();

    const projection = d3.geoAlbersUsa();

      let data1 = new Map()
      const colorScale = d3.scaleThreshold()
        .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
        .range(d3.schemeBlues[7]);
      
      // Load external data and boot
      Promise.all([
      d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
      d3.csv("data/us-state-covid-abbr.csv", function(d) {
          data1.set(d.state, +d.cases)
          var test = d3.rollup(data, v => d3.sum(v, d => +d.cases), d => d.state)
          // console.log(test)

      })
      
      ]).then(function(loadData){
          let topo = loadData[0]

          console.log("Hello World")
          console.log(loadData)
          
      
          // Draw the map
        svg3.append("g")
          .selectAll("path")
          .data(topo.features)
          .join("path")
            // draw each state
            .attr("d", d3.geoPath()
              .projection(projection)
            )
            // set color of each state
            .attr("fill", function (d) {
              d.total = data1.get(d.id) || 0;
              return colorScale(d.total);
            })
      })
})
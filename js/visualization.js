

// Set dimensions and margins for plots 
const width = 1500; 
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


// https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv
// data/us-states-covid-data.csv
d3.csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv',
function(d){
        return {
            date : d.date,
            state : d.state,
            fips : +d.fips,
            cases : +d.cases,
            deaths : +d.deaths
        };
    }).then(function(data) {
        for (i = 0; i < 10; i++) {
            console.log(data[i]);
        }


var parser = d3.timeParse("%Y-%m-%d")

// hard code data
const d1 = [{date: "2020-01-21", cases:8500000},
{date: "2020-01-21", cases:4200000}, {date: "2020-01-21", cases:6900000},
{date: "2020-01-21", cases:1100000}, {date: "2020-01-21", cases:1234567},
{date: "2020-01-21", cases:8765432}, {date: "2020-01-21", cases:6666666},
{date: "2020-01-21", cases:7172002}, {date: "2020-01-21", cases:8500000},
{date: "2020-01-21", cases:4200000}]

xKey1 = "date";
yKey1 = "cases";
// let minX1 = d3.min(data, (d) => {return parser(d[xKey1]);});
// let maxX1 = d3.max(data, (d) => {return parser(d[xKey1]);});
let minX1 = parser("2021-10-03");
let maxX1 = parser("2021-10-10");


let minY1 = d3.min(data, function(d) { return d.cases; });
let maxY1 = d3.max(data, function(d) { return d.cases; });

let xScale1 = d3.scaleBand()
            .domain(d3.range(10))
            .range([margin.left, width - margin.right])
            .padding(0.1);
            
let yScale1 = d3.scaleLinear()
            .domain([minY1,maxY1])
            .range([height-margin.bottom,margin.top]); 

// y-axis markings
svg1.append("g")
   .attr("transform", `translate(${margin.left}, 0)`) 
   .call(d3.axisLeft(yScale1)) 
   .attr("font-size", '20px'); 

// x-axis markings
svg1.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`) 
    .call(d3.axisBottom(xScale1)
            .tickFormat(i => data[i][xKey1]))
    .attr("font-size", '10px'); 
    
svg1.selectAll(".bar")
  .data(d1)
  .enter()
  .append("rect") 
  .attr("class", "bar") 
  .attr("x", (d, i) => xScale1(i)) 
  .attr("y", (d) => yScale1(d[yKey1])) 
  .attr("height", (d) => (height - margin.bottom) - yScale1(d[yKey1]))
  .attr("width", xScale1.bandwidth()) 

const svg2 = d3
  .select("#vis-container")
  .append("svg")
  .attr("width", width-margin.left-margin.right)
  .attr("height", height - margin.top - margin.bottom)
  .attr("viewBox", [0, 0, width, height]);
  
let xScale2 = d3.scaleLinear()
            .domain([0, 10])
            .range([margin.left, width - margin.right]);

let yScale2 = d3.scaleLinear()
            .domain([minY1,maxY1])
            .range([height-margin.bottom,margin.top]); 


svg2.append("g")
.attr("transform", `translate(${margin.left}, 0)`)  
   .call(d3.axisLeft(yScale2)) 
   .attr("font-size", '20px'); 


svg2.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`) 
    .call(d3.axisBottom(xScale2)
    .tickFormat(i => data[i][xKey1]))
    .attr("font-size", '20px'); 

let line = d3.line()
            .x(function(d, i) {return xScale2(i);})
            .y(function(d) {return yScale2(d[yKey1]);})

svg2.append("path")
    .data(d1)
    .attr("class", "line")
    .style("fill", "none")
    .style('stroke', 'red')
    .style('stroke-width', 2)
    .attr("transform", "translate(" + 200 + "," + 200 + ")")
    .attr('d', line);
 })

//   d3.csv('data/us-states-covid-data.csv', function(err, rows){
//     function unpack(rows, key) {
//         return rows.map(function(row) { return row[key]; });
//     }

//     const margin = { top: 50, right: 50, bottom: 50, left: 200 };
//     const width = 900;
//     const height = 650;

//     const svg2 = d3.select("#vis-holder")
//                 .append("svg")
//                 .attr("width", width - margin.left - margin.right)
//                 .attr("height", height - margin.top - margin.bottom)
//                 .attr("viewBox", [0, 0, width, height]); 

//     var data = [{
//         type: 'choropleth',
//         locationmode: 'USA-states',
//         locations: unpack(rows, 'fips'),
//         z: unpack(rows, 'cases'),
//         text: unpack(rows, 'state'),
//         zmin: 0,
//         zmax: 17000,
//         colorscale: [
//             [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
//             [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
//             [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
//         ],
//         colorbar: {
//             title: 'Cases',
//             thickness: 0.2
//         },
//         marker: {
//             line:{
//                 color: 'rgb(255,255,255)',
//                 width: 2
//             }
//         }
//     }];


//     var layout = {
//         title: 'COVID-19 Cases',
//         geo:{
//             scope: 'usa',
//             showlakes: true,
//             lakecolor: 'rgb(255,255,255)'
//         }
//     };

//     Plotly.newPlot("myDiv", data, layout, {showLink: false});

//     const d1 = [ {Day: "Monday", Count: 50},
//     {Day: "Tuesday", Count: 50},
//     {Day: "Wednesday", Count: 50}, {Day: "Thursday", Count: 50}, {Day: "Friday", Count: 50},
//     {Day: "Saturday", Count: 50}, {Day: "Sunday", Count: 50}];

//     let xKey1 = "Day";
//     let yKey1 = "Count"

//     let maxY1 = d3.max(d1, function(d) {return d[xKey1];});

//     let x1 = d3.scaleBand()
//             .domain(d3.range(d1.length))
//             .range([margin.left, width - margin.right])
//             .padding(0.1);

//     let y1 = d3.scaleLinear()
//             .domain([0, maxY1])
//             .range([height - margin.bottom, margin.top]);

//     svg2.append("g")
//             .attr("transform", `translate(0, ${height - margin.bottom})`)
//             .call(d3.axisBottom(x1)
//                     .tickFormat(i => d1[i][xKey1]))
//             .attr("font-size", "20px")
//             .call((g) => g.append("text")
//                           .attr("x", width - margin.right)
//                           .attr("y", margin.bottom - 5)
//                           .attr("fill", "black")
//                           .attr("text-anchor", "end")
//                           .text(xKey1));

//     svg2.append("g")
//                 .attr("transform", `translate(${margin.left}, 0)`)
//                 .call(d3.axisLeft(y1))
//                 .attr("font-size", "20px")
//                 .call((g) => g.append("text")
//                             .attr("x", 0)
//                             .attr("y", margin.top - 10)
//                             .attr("fill", "black")
//                             .attr("text-anchor", "end")
//                             .text(yKey1));

//     bars = svg3.selectAll(".bar")
//                 .data(d1)
//                 .enter()
//                 .append('rect')
//                 .attr("class", "bar")
//                 .attr("x", (d, i) => x1(i))
//                 .attr("y", (d) => y1(d[yKey1]))
//                 .attr("height", (d) => (height - margin.bottom) - y1(d[yKey1]))
//                 .attr("width", x1.bandwidth())
//                 .style("opacity", 0.5)
//                 .style("fill", (d) => color(d.Day));
// })

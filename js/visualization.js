//This is filler -- delete it and start coding your visualization tool here
d3.select("#vis-container")
  .append("text")
  .attr("x", 20)
  .attr("y", 20)
  .text("Hello World!");

  d3.csv('data/us-states-covid-data.csv', function(err, rows){
    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

    const margin = { top: 50, right: 50, bottom: 50, left: 200 };
    const width = 900;
    const height = 650;

    const svg2 = d3.select("#vis-holder")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]); 

    var data = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: unpack(rows, 'fips'),
        z: unpack(rows, 'cases'),
        text: unpack(rows, 'state'),
        zmin: 0,
        zmax: 17000,
        colorscale: [
            [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
            [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
            [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
        ],
        colorbar: {
            title: 'Cases',
            thickness: 0.2
        },
        marker: {
            line:{
                color: 'rgb(255,255,255)',
                width: 2
            }
        }
    }];


    var layout = {
        title: 'COVID-19 Cases',
        geo:{
            scope: 'usa',
            showlakes: true,
            lakecolor: 'rgb(255,255,255)'
        }
    };

    Plotly.newPlot("myDiv", data, layout, {showLink: false});

    const d1 = [ {Day: "Monday", Count: 50},
    {Day: "Tuesday", Count: 50},
    {Day: "Wednesday", Count: 50}, {Day: "Thursday", Count: 50}, {Day: "Friday", Count: 50},
    {Day: "Saturday", Count: 50}, {Day: "Sunday", Count: 50}];

    let xKey1 = "Day";
    let yKey1 = "Count"

    let maxY1 = d3.max(d1, function(d) {return d[xKey1];});

    let x1 = d3.scaleBand()
            .domain(d3.range(d1.length))
            .range([margin.left, width - margin.right])
            .padding(0.1);

    let y1 = d3.scaleLinear()
            .domain([0, maxY1])
            .range([height - margin.bottom, margin.top]);

    svg2.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x1)
                    .tickFormat(i => d1[i][xKey1]))
            .attr("font-size", "20px")
            .call((g) => g.append("text")
                          .attr("x", width - margin.right)
                          .attr("y", margin.bottom - 5)
                          .attr("fill", "black")
                          .attr("text-anchor", "end")
                          .text(xKey1));

    svg2.append("g")
                .attr("transform", `translate(${margin.left}, 0)`)
                .call(d3.axisLeft(y1))
                .attr("font-size", "20px")
                .call((g) => g.append("text")
                            .attr("x", 0)
                            .attr("y", margin.top - 10)
                            .attr("fill", "black")
                            .attr("text-anchor", "end")
                            .text(yKey1));

    bars = svg3.selectAll(".bar")
                .data(d1)
                .enter()
                .append('rect')
                .attr("class", "bar")
                .attr("x", (d, i) => x1(i))
                .attr("y", (d) => y1(d[yKey1]))
                .attr("height", (d) => (height - margin.bottom) - y1(d[yKey1]))
                .attr("width", x1.bandwidth())
                .style("opacity", 0.5)
                .style("fill", (d) => color(d.Day));
});
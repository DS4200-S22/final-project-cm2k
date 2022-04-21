
// Set dimensions and margins for plots 
const width = 1200;
const height = 450;
const margin = { left: 50, right: 50, bottom: 50, top: 50 };
const yTooltipOffset = 15;

// Creates an svg window for the bar chart
const svg1 = d3
  .select("#vis-container")
  .append("svg")
  .attr("width", width - margin.left - margin.right)
  .attr("height", height - margin.top - margin.bottom)
  .attr("viewBox", [0, 0, width, height]);

const format = d3.timeFormat("%b %d, %Y");
const parser = d3.timeParse("%Y-%m-%d");

d3.csv('https://raw.githubusercontent.com/DS4200-S22/final-project-cm2k/main/data/us-state-covid-abbr.csv',
  function (d) {
    return {
      date: new Date(format(parser(d.date))),
      state: d.state,
      cases: +d.cases,
      deaths: +d.deaths,
      abbr_state: d.abbr_state
    };
  }).then(function (data) {

    let bama = data.filter(d => d.abbr_state === 'AL');
    let wash = data.filter(d => d.abbr_state === 'WA');
    // passing in data but not specifying specific column you want to print out

    let test = d3.rollup(data, v => d3.sum(v, d => +d.cases), d => d.state)
    let format = d3.timeFormat("%b %d, %Y");
    let parser = d3.timeParse("%Y-%m-%d")


    let casesByDate = d3.rollups(data, v => d3.sum(v, j => j.cases), d => d.date.toString()); // this is an array of arrays
    casesByDate = d3.merge(casesByDate); // this breaks the array of arrays. Creates one giant array that's like [date, cases, date2, cases2]

    let deathsByDate = d3.rollups(data, v => d3.sum(v, j => j.deaths), d => d.date.toString());


    let washingtonCasesByDate = d3.rollups(wash, v => d3.sum(v, j => j.cases), d => d.date.getYear(), d => d.date.getMonth());

    xKey1 = "date";
    yKey1 = "cases";

    let minY1 = 0;
    let maxY1 = d3.max(bama, function (bama) { return bama.cases; });

    const dates = new Set(data.map(d => d.date))
    const dateArray = Array.from(dates)

    const xScale1 = d3.scaleBand()
      .domain(d3.range(dateArray.length / 53))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale1 = d3.scaleLinear()
      .domain([minY1, maxY1])
      .range([height - margin.bottom, margin.top]);

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
        .tickFormat(i => format(bama[i][xKey1]))
        .tickValues(xScale1.domain().filter(function (d, i) { return !(i % 80) })))
      .attr("font-size", '8px')
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
    const mouseover1 = function (event, d) {
      tooltip1.html("Total cases: " + d.cases + "<br> Total deaths: " + d.deaths + "<br>")
        .style("opacity", 1);
    }

    // Moves the information pop up to where the mouse moves.
    const mousemove1 = function (event, d) {
      tooltip1.style("left", (event.x) + "px")
        .style("top", (event.y + yTooltipOffset) + "px");
    }

    // When the mouse is not hovering a bar, the pop up disappears.
    const mouseleave1 = function (event, d) {
      tooltip1.style("opacity", 0);
    }

    svg1.selectAll(".bar")
      .data(bama)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (bama, i) {
        // returns correspodning pixel value
        return xScale1(i)
      })
      .attr("y", function (bama) {
        return yScale1(bama["cases"]);
      })
      .attr("height", (bama) => (height - margin.bottom) - yScale1(bama["cases"]))
      .attr("width", xScale1.bandwidth())
      .on("mouseover", mouseover1)
      .on("mousemove", mousemove1)
      .on("mouseleave", mouseleave1);

    // brushing the bar graph
    brushB = d3.brushX()
      .extent([[margin.left, margin.bottom],
      [width - margin.right, height - margin.top]])
      .on("end", updateBar)

    svg1.call(brushB)

    // line graph starts
    const svg2 = d3
      .select("#vis-container")
      .append("svg")
      .attr("width", width - margin.left - margin.right)
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
      .text(function (d) { return d; })
      .attr('value', function (d) { return d; })

    let colorLine = d3.scaleOrdinal()
      .domain(states)
      .range(d3.schemeSet2);

    let xScale2 = d3.scaleBand()
      .domain(d3.range(dateArray.length / 53))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    let yScale2 = d3.scaleLinear()
      .domain([minY1, maxY1])
      .range([height - margin.bottom, margin.top]);


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
        .tickFormat(i => format(bama[i][xKey1]))
        .tickValues(xScale2.domain().filter(function (d, i) { return !(i % 80) })))
      .attr("font-size", '8px')
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

    svg2.append("path")
      .datum(bama)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // brushing the bar graph
    brushL = d3.brushX()
      .extent([[margin.left, margin.bottom],
      [width - margin.right, height - margin.top]])
      .on("end", updateLine)

    svg2.call(brushL)

    // update the selection
    function update(selectedGroup) {
      const dataFiltered = data.filter(function (d) { return d.state == selectedGroup })
      line.datum(dataFiltered)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function (d) { return x(d.date) })
          .y(function (d) { return y(+d.n) })
        )
        .attr("stroke", function (d) { return myColor(selectedGroup) })
    }

    d3.select('#selectButton').on("change", function (event, d) {
      const selectedOption = d3.select(this).property("value")
      update(selectedOption)
    })



    // chloropleth -----------------------------------------

    // hard code data
    const tempMapData = [{ state_abbr: "MA", cases: 100 },
    { state_abbr: "PA", cases: 1000 },
    { state_abbr: "AZ", cases: 50 },
    { state_abbr: "NY", cases: 10000 },
    { state_abbr: "CA", cases: 4566 },
    { state_abbr: "NJ", cases: 23458 },
    { state_abbr: "OH", cases: 8567 },
    { state_abbr: "MN", cases: 3456 },
    { state_abbr: "TX", cases: 76345 },
    { state_abbr: "AK", cases: 2 },
    { state_abbr: "WV", cases: 4523 },
    { state_abbr: "VT", cases: 98765 }]

    const svg3 = d3
      .select("#vis-container")
      .append("svg")
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("viewBox", [0, 0, width, height]);

    const path = d3.geoPath();

    const projection = d3.geoAlbersUsa();

    let data1 = new Map()
    const colorScale = d3.scaleThreshold()
      .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
      .range(d3.schemeBlues[7]);

    // Load external data and boot
    // temp map data:
    // https://raw.githubusercontent.com/DS4200-S22/final-project-cm2k/main/data/map_cases_covid
    // og:
    // data/us-state-covid-abbr.csv
    Promise.all([
      d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
      d3.csv("https://raw.githubusercontent.com/DS4200-S22/final-project-cm2k/main/data/map_cases_covid", function (d) {
        data1.set(d.state, +d.cases)
      })

    ]).then(function (loadData) {
      let topo = loadData[0]
      let cov = loadData[1]

      let newData = d3.rollup(cov, v => d3.sum(v, d => +d.cases), d => d.state)

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


    // FUNCTIONS TO UPDATE VIA BRUSHING
    function updateBar(brushEvent, d) {
      let newDates = brushEvent.selection;

      let xTime1 = d3.scaleTime()
        .domain(d3.extent(dateArray))
        .range([margin.left, width - margin.right]);

      let early = xTime1.invert(newDates[0])
      let latest = xTime1.invert(newDates[1])

      let newRange = getDates(early, latest)
    }

    function updateLine(brushEvent, d) {
      let newDates = brushEvent.selection;

      let xTime1 = d3.scaleTime()
        .domain(d3.extent(dateArray))
        .range([margin.left, width - margin.right]);

      let early = xTime1.invert(newDates[0])
      let latest = xTime1.invert(newDates[1])

      let newRange = getDates(early, latest)
    }

    function getDates(start, end) {
      for (let dates = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
        dates.push(new Date(dt));
      }
      return dates;
    };

  })
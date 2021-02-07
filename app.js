var width = 800;
var height = 500;
var padding = 30;

// var yMax = d3.max(birthData2011, (d)=>d.lifeExpectancy);
// var yMin = d3.min(birthData2011, (d)=>d.lifeExpectancy);
var xMinAndMax = d3.extent(birthData2011, d => d.births / d.population); //extent metoda vraća array sa najmanjom i najvećom value
var yMinAndMax = d3.extent(birthData2011, d=>d.lifeExpectancy); 

var xScale = d3.scaleLinear()
                .domain(xMinAndMax)
                .range([padding, width-padding]);

var yScale = d3.scaleLinear()
                .domain(yMinAndMax)
                .range([height - padding, padding]);

var xAxis = d3.axisBottom(xScale)
                .tickSize(-height + 2*padding)
                .tickSizeOuter(0);
var yAxis = d3.axisLeft(yScale)
                .tickSize(-width + 2*padding)
                .tickSizeOuter(0);
               
var colorScale = d3.scaleLinear()
                    .domain(d3.extent(birthData2011, d=>d.population/d.area))
                    .range(["#f5c542", "#5e0202"]);

var radiusScale = d3.scaleLinear()
                    .domain(d3.extent(birthData2011, d=>d.births))
                    .range([2,40]);

var tooltip = d3.select("body")
                .append("div")
                .classed("tooltip", true)

d3.select("svg")
    .append("g")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(xAxis);
d3.select("svg")
    .append("g")
        .attr("transform", `translate(${padding})`)
        .call(yAxis);

d3.select("svg")
    .attr("width", width)
    .attr("height", height)
  .selectAll("circle")
  .data(birthData2011)
.enter()
.append("circle")
    .attr("cx", d => xScale(d.births / d.population))
    .attr("cy", d => yScale(d.lifeExpectancy))
    .attr("fill", d => colorScale(d.population/d.area))
    .attr("r", d => radiusScale(d.births))
    .on("mousemove", (e, d)=>{showTooltip(e, d)} )
    .on("touchStart", (e, d)=>{showTooltip(e, d)})
    .on("mouseout", ()=>{
        tooltip
            .style("opacity", 0)
    })
    .on("touchEnd", ()=>{
        tooltip
            .style("opacity", 0)
    })

d3.select("svg")
    .append("text")
        .attr("x", width/2)
        .attr("y", height - padding)
        .attr("dy", "1.5em")
        .attr("text-anchor", "middle")
        .text("Births per Capita");

d3.select("svg")
    .append("text")
        .attr("x", width/2)
        .attr("y", padding)
        // .attr("dy", "1.5em")
        .attr("text-anchor", "middle")
        .attr("font-size", "1.5em")
        .text("Data on Births By Country in 2011");

d3.select("svg")
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height /2)
        .attr("y", padding)
        .attr("dy", "-1.1em")
        .attr("text-anchor", "middle")
        .text("Life Expectancy")


function showTooltip(e, d){
    var moveTooltip = tooltip.node().offsetWidth / 2
    // console.log(tooltip.node().offsetWidth);
    tooltip
        .style("opacity", 1)
        .style("left", e.screenX - moveTooltip +"px")
        .style("top",  e.screenY - moveTooltip/2 +"px")
        .html(`
            <p>Region: ${d.region}</p>
            <p>Births: ${d.births.toLocaleString()}</p>
            <p>Population: ${d.population.toLocaleString()}</p>
            <p>Area: ${d.area.toLocaleString()}</p>
            <p>LifeExpectancy: ${d.lifeExpectancy}</p>
        `)
}
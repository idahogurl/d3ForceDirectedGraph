const SERVICE_URL = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";
//<img src="blank.gif" class="flag flag-cz" alt="Czech Republic" />
//https://bl.ocks.org/curran/c48b1c89157cb98e389a63c4acc240e3
//https://medium.com/@sxywu/understanding-the-force-ef1237017d5
//http://stackoverflow.com/questions/41232299/svg-sprite-pattern-not-working-in-d3
//http://stackoverflow.com/questions/28111480/adding-tooltip-to-svg-rect-tag

require("./sass/styles.scss");
import * as d3 from 'd3';

class Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;

    constructor(top:number, right:number, bottom:number, left:number)
    {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left= left;
    }    
}
class Country
{
    id:number;
    name:string;
    code:string;
    x:number;
    y:number;
    //vx:number;
    //vy:number;

    constructor(id:number, name:string, code:string)
    {
        this.id = id;
        this.name = name;
        this.code = code;
    }
}
class Link
{
    source:Country;
    target:Country;

    constructor(source:Country, target:Country)
    {
        this.source = source;
        this.target = target;
    }
}
class ForceDirectedGraph
{
 constructor()
 {
     this.fetchData();
 }
 createChart(nodes:Country[], links:Link[])
 {
   
//top,right,bottom,left
    let margin = new Margin(0, 50, 0, 50);
    let height = 800 - margin.top - margin.bottom;
    let width = 1000 - margin.left - margin.right;

    let svgChart = d3.select("#chart").append("svg")
        .style("background", "#00FF00")
       .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + ", " + margin.top +")")
        .append("g");
    

    let tooltip = d3.select("#tooltip")
            .append("div")
            .style("pointer-events", "none")
            .style("position", "absolute")
            .style("padding", "10px")
            .style("background", "black")
            .style("color", "white")
            .style("width", "150px")
            .style("opacity", 0);

    let node = svgChart.selectAll("rect")
            .data(nodes)
            .enter()
            .append("rect")
            .attr("class", c => {
                return "flag flag-" + c.code
            });
            
            
    var link = svgChart.selectAll("line")
            .data(links).enter()
            .append("line")
            .attr("stroke", "#FF0000")
            .attr("stroke-width", 1)

    let sim = d3.forceSimulation<Country, Link>(nodes)
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("charge", d3.forceManyBody().distanceMax(180))
    //.strength(-10))
    .force("links", d3.forceLink(links));

    sim.on("tick", () => 
    {
        node.attr("x", (d:Country) => {
                return d.x;
            })
            .attr("y", (d:Country) => {
                return d.y;
            })
            .append("title")
            .html((d:Country) => {
                return d.name
            });

        link.attr("x1", 
            (d:Link) => {
                return d.source.x;
            })
            .attr("y1", (d:Link) => {
                return d.source.y;
            })
            .attr("x2", (d:Link) => {
                return d.target.x;})
            .attr("y2", (d:Link) => {
                return d.target.y;});
            });    
 }
 fetchData()
 {
    let self = this;
    d3.json(SERVICE_URL, d => 
    {
       let nodes:Country[] = [];
       let i = 1;
       d.nodes.forEach(n => {
        nodes.push(new Country(i, n.country, n.code));
        i++;
       });
       
       let links:Link[] = [];
       d.links.forEach(l => {
            links.push(new Link(nodes[l.source], nodes[l.target]));
       });
       self.createChart(nodes, links);      
    });
 }
}
let chart = new ForceDirectedGraph();
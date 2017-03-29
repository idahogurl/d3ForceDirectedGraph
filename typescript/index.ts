const SERVICE_URL = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";

//https://bl.ocks.org/curran/c48b1c89157cb98e389a63c4acc240e3
//https://medium.com/@sxywu/understanding-the-force-ef1237017d5
//http://stackoverflow.com/questions/28111480/adding-tooltip-to-svg-rect-tag

import * as d3 from 'd3';
import * as d3_box from 'd3-bboxCollide';

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
    let height = 900 - margin.top - margin.bottom;
    let width = 1200 - margin.left - margin.right;

    let svgChart = d3.select("#chart").append("svg")
        .style("background", "#000")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
        
    
                            
    let link = svgChart.append("g")
            .selectAll("line")
            .data(links).enter()
            .append("line")
            .attr("stroke", "#FFF")
            .attr("stroke-width", 1);

    let node = svgChart.append("g")
        .selectAll("image")
        .data(nodes)
        .enter()
        .append("image")
        .attr("width", 16)
        .attr("height", 11)
        .attr("xlink:xlink:href", (d:Country) =>
        {
            return "./flags/" + d.code +".png";
        });

   var rectangleCollide = d3_box.bboxCollide([[-20,-20],[20,20]])

    let sim = d3.forceSimulation<Country, Link>(nodes)
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("charge", d3.forceManyBody().distanceMin(50).distanceMax(50))
    .force("collide", rectangleCollide)
    //.strength(-10))
    .force("links", d3.forceLink(links).distance(50));

    sim.on("tick", () => 
    {
   //http://bl.ocks.org/natebates/273b99ddf86e2e2e58ff
        node.attr("x", (d:Country) => {
                return d.x;
            })
            .attr("y", (d:Country) => {
                return d.y;
            });

        link.attr("x1", 
            (d:Link) => {
                return d.source.x;
            })
            .attr("y1", (d:Link) => {
                return d.source.y;
            })
            .attr("x2", (d:Link) => {
                return d.target.x;
            })
            .attr("y2", (d:Link) => {
                return d.target.y;
            });
    });    

    node.append("title")
        .text((d:Country) => {
            return d.name
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
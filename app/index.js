"use strict";
var SERVICE_URL = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";
//<img src="blank.gif" class="flag flag-cz" alt="Czech Republic" />
//https://bl.ocks.org/curran/c48b1c89157cb98e389a63c4acc240e3
//https://medium.com/@sxywu/understanding-the-force-ef1237017d5
//http://stackoverflow.com/questions/41232299/svg-sprite-pattern-not-working-in-d3
//http://stackoverflow.com/questions/28111480/adding-tooltip-to-svg-rect-tag
require("./sass/styles.scss");
var d3 = require("d3");
var Margin = (function () {
    function Margin(top, right, bottom, left) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
    return Margin;
}());
var Country = (function () {
    //vx:number;
    //vy:number;
    function Country(id, name, code) {
        this.id = id;
        this.name = name;
        this.code = code;
    }
    return Country;
}());
var Link = (function () {
    function Link(source, target) {
        this.source = source;
        this.target = target;
    }
    return Link;
}());
var ForceDirectedGraph = (function () {
    function ForceDirectedGraph() {
        this.fetchData();
    }
    ForceDirectedGraph.prototype.createChart = function (nodes, links) {
        //top,right,bottom,left
        var margin = new Margin(0, 50, 0, 50);
        var height = 800 - margin.top - margin.bottom;
        var width = 1000 - margin.left - margin.right;
        var svgChart = d3.select("#chart").append("svg")
            .style("background", "#00FF00")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .append("g");
        var tooltip = d3.select("#tooltip")
            .append("div")
            .style("pointer-events", "none")
            .style("position", "absolute")
            .style("padding", "10px")
            .style("background", "black")
            .style("color", "white")
            .style("width", "150px")
            .style("opacity", 0);
        var node = svgChart.selectAll("rect")
            .data(nodes)
            .enter()
            .append("rect")
            .attr("class", function (c) {
            return "flag flag-" + c.code;
        });
        var link = svgChart.selectAll("line")
            .data(links).enter()
            .append("line")
            .attr("stroke", "#FF0000")
            .attr("stroke-width", 1);
        var sim = d3.forceSimulation(nodes)
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("charge", d3.forceManyBody().distanceMax(180))
            .force("links", d3.forceLink(links));
        sim.on("tick", function () {
            node.attr("x", function (d) {
                return d.x;
            })
                .attr("y", function (d) {
                return d.y;
            })
                .append("title")
                .html(function (d) {
                return d.name;
            });
            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                return d.source.y;
            })
                .attr("x2", function (d) {
                return d.target.x;
            })
                .attr("y2", function (d) {
                return d.target.y;
            });
        });
    };
    ForceDirectedGraph.prototype.fetchData = function () {
        var self = this;
        d3.json(SERVICE_URL, function (d) {
            var nodes = [];
            var i = 1;
            d.nodes.forEach(function (n) {
                nodes.push(new Country(i, n.country, n.code));
                i++;
            });
            var links = [];
            d.links.forEach(function (l) {
                links.push(new Link(nodes[l.source], nodes[l.target]));
            });
            self.createChart(nodes, links);
        });
    };
    return ForceDirectedGraph;
}());
var chart = new ForceDirectedGraph();

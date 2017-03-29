"use strict";
var SERVICE_URL = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";
//https://bl.ocks.org/curran/c48b1c89157cb98e389a63c4acc240e3
//https://medium.com/@sxywu/understanding-the-force-ef1237017d5
//http://stackoverflow.com/questions/28111480/adding-tooltip-to-svg-rect-tag
var d3 = require("d3");
var d3_box = require("d3-bboxCollide");
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
        var height = 900 - margin.top - margin.bottom;
        var width = 1200 - margin.left - margin.right;
        var svgChart = d3.select("#chart").append("svg")
            .style("background", "#000")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
        var link = svgChart.append("g")
            .selectAll("line")
            .data(links).enter()
            .append("line")
            .attr("stroke", "#FFF")
            .attr("stroke-width", 1);
        var node = svgChart.append("g")
            .selectAll("image")
            .data(nodes)
            .enter()
            .append("image")
            .attr("width", 16)
            .attr("height", 11)
            .attr("xlink:xlink:href", function (d) {
            return "./flags/" + d.code + ".png";
        });
        var rectangleCollide = d3_box.bboxCollide([[-20, -20], [20, 20]]);
        var sim = d3.forceSimulation(nodes)
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("charge", d3.forceManyBody().distanceMin(50).distanceMax(50))
            .force("collide", rectangleCollide)
            .force("links", d3.forceLink(links).distance(50));
        sim.on("tick", function () {
            //http://bl.ocks.org/natebates/273b99ddf86e2e2e58ff
            node.attr("x", function (d) {
                return d.x;
            })
                .attr("y", function (d) {
                return d.y;
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
        node.append("title")
            .text(function (d) {
            return d.name;
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

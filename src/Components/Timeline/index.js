import React, { useRef } from 'react';
import * as d3 from "d3";
import styles from './timeline.css'
import _ from 'underscore'
import moment, { updateLocale } from 'moment'
import { updateExpression } from '@babel/types';

const Timeline = ({dataItems, start, end, refTimes}) => {
  // var formatTime = d3.timeFormat();
  // add items to timeline
  const items = [];
  let index = 0;
  var timeBegin = new Date(Date.parse(start))
  var timeEnd = new Date(Date.parse(end))
  var d = new Date(Date.parse(start))
  while(d < timeEnd){
    var ds = new Date(d)
    var df = new Date(d).setHours(d.getHours() + 2)
    items.push({
      lane : 0,
      id : index,
      start : ds,
      end : df,
      refTime: refTimes[index]
    });
    index += 1;
    d.setHours(d.getHours() + 3)
  };
  console.log(items)
  // const latestEndTime = _.max(items, i => moment.utc(i.end)).end;
  // const timeEnd = latestEndTime;
  // const timeBegin = moment.utc(timeEnd).subtract(1, "day");

  // var time1 = formatTime(Date.now());
  // var time2 = formatTime(Date.now() + 60 * 60 * 1000);

  var lanes = ["Model runs"];

  var margin = { top: 250, right: 40, bottom: 250, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var scale = d3.scaleTime()
    .domain([timeBegin, timeEnd])
    .range([0, width]);

  var xAxis = d3.axisBottom()
    .scale(scale)
    .tickFormat(d3.timeFormat("%H:%M"));


  var maxExtent;
  var minExtent;
  const ref = useRef()

  var currentTime = Date.now();

  let svgElement = d3.select(ref.current);

  var m = [20, 15, 15, 150], //top right bottom left
    w = 960,
    h = 40,
    miniHeight = 1;

  //scales
  var x = d3.scaleTime()
    .domain([timeBegin, timeEnd])
    .range([0, w]);

  var x1 = d3.scaleLinear()
    .range([0, w]);

  var y1 = d3.scaleLinear()
    .domain([0, 1])
    .range([0, miniHeight]);
  var y2 = d3.scaleLinear()
    .domain([0, 1])
    .range([0, miniHeight]);

  svgElement = d3.select("div#container")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1200 1200")
    .classed("svg-content", true)
    .attr("class", "chart");

  var mini = svgElement.append("g")
    .attr("transform", "translate(" + m[3] + "," + (m[0]) + ")")
    .attr("width", w)
    .attr("height", miniHeight)
    .attr("class", "timeline");

  //mini lanes and texts
  mini.append("g").selectAll(".laneLines")
    .data(items)
    .enter().append("line")
    .attr("x1", currentTime)
    .attr("x2", currentTime)
    .attr("y1", 0)
    .attr("y2", miniHeight)
    .attr("stroke", "black");

  mini.append("g").selectAll(".laneText")
    .data(lanes)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", -m[1])
    .attr("y", function (d, i) { return y2(i + .5); })
    .attr("dy", ".5ex")
    .attr("text-anchor", "end")
    .attr("class", "laneText");

  var itemRects = mini.append("g")
    .attr("clip-path", "url(#clip)");
  
  var selected;

  //mini item rects
  mini.append("g").selectAll("miniItems")
    .data(items)
    .enter().append("rect")
    .attr("class", function (d) { return "miniItem" + d.lane; })
    .attr("x", function (d) { return x(d.start); })
    .attr("y", function (d) { return y2(d.lane + .5) - 5; })
    .attr("width", function (d) { return (x(d.end) - x(d.start)); })
    .attr("height", 10)
    .style('fill', d => d.refTime ? "#18515E": "#707070")
    .on("click", function click(){       
      if(!selected){
        selected = this;
        d3.select(selected).style('fill', '#8ba8ae');
     } 
     else {
        d3.select(selected).style('fill', '#18515E');
        selected = this;
        d3.select(selected).style('fill', '#8ba8ae');
     }
   });


  //mini labels
  /*mini.append("g").selectAll(".miniLabels")
    .data(items)
    .enter().append("text")
    .text(function (d) { return d.id; })
    .attr("x", function (d) { return x(d.start); })
    .attr("y", function (d) { return y2(d.lane + .5); })
    .attr("dy", ".5ex");*/

  mini.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis.ticks(24));

  mini.append("g")
    .selectAll("rect")
    .attr("y", 1)
    .attr("height", miniHeight - 1);

  display();


  function display() {
    var rects, labels,
      visItems = items.filter(function (d) { return d.start < maxExtent && d.end > minExtent; });

    x1.domain([minExtent, maxExtent]);

    //update main item rects
    rects = itemRects.selectAll("rect")
      .data(items, function (d) { return d.id; })
      .attr('id', d => d.start)
      .attr("x", function (d) { return x(d.start); })
      .attr("width", function (d) { return x(d.end) - x(d.start); });

    rects.enter().append("rect")
      .attr("class", function (d) { return "miniItem" + d.lane; })
      .attr("x", function (d) { return x(d.start); })
      .attr("width", function (d) { return x(d.end) - x(d.start); })

    rects.exit().remove();

    //update the item labels
    labels = itemRects.selectAll("text")
      .data(items, function (d) { return d.id; })
      .attr("x", function (d) { return x1(Math.max(d.start, minExtent) + 2); });

    labels.enter().append("text")
      .text(function (d) { return d.id; })
      .attr("x", function (d) { return x1(Math.max(d.start, minExtent)); })
      .attr("text-anchor", "start");

    labels.exit().remove();

  }
  return null;
}


export default Timeline

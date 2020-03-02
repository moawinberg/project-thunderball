import React, { useRef } from 'react';
import * as d3 from "d3";
import styles from './timeline.css'


// const getTimelineData = () => {
//     const [fetch, isLoading, data, error] = useFetch();

//     //fetch data
//     useEffect(() => {
//         fetch(/*insert URL*/)
//     },[]);

//     //display data when it arrives
//     useEffect(() => {
//         if (!isLoading && !(data === null) && (error === null)) {
//             // do stuff with data here
//         }
//     }, [data, isLoading, error]);
// }

const Timeline = () => {
  var lanes = ["Chinese"],
    laneLength = lanes.length,
    items = [{ "lane": 0, "id": "Qin", "start": 5, "end": 205 },
    { "lane": 0, "id": "Jin", "start": 265, "end": 420 },
    { "lane": 0, "id": "Sui", "start": 580, "end": 615 },
    { "lane": 0, "id": "Tang", "start": 620, "end": 900 },
    { "lane": 0, "id": "Song", "start": 960, "end": 1265 },
    { "lane": 0, "id": "Yuan", "start": 1270, "end": 1365 },
    { "lane": 0, "id": "Ming", "start": 1370, "end": 1640 },
    { "lane": 0, "id": "Qing", "start": 1645, "end": 1910 },];

  var timeBegin = 0;
  var timeEnd = 2000;
  var maxExtent;
  var minExtent;
  const ref = useRef()

  let svgElement = d3.select(ref.current);

  var m = [20, 15, 15, 120], //top right bottom left
    w = 960 - m[1] - m[3],
    h = 500 - m[0] - m[2],
    miniHeight = laneLength * 12 + 50,
    mainHeight = h - miniHeight - 50;

  //scales
  var x = d3.scaleLinear()
    .domain([timeBegin, timeEnd])
    .range([0, w]);
  var x1 = d3.scaleLinear()
    .range([0, w]);
  var y2 = d3.scaleLinear()
    .domain([0, laneLength])
    .range([0, miniHeight]);

  svgElement = d3.select("body")
    .append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .attr("class", "chart");

  svgElement.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", w)
    .attr("height", mainHeight);

  var main = svgElement.append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
    .attr("width", w)
    .attr("height", mainHeight)
    .attr("class", "main");

  var mini = svgElement.append("g")
    .attr("transform", "translate(" + m[3] + "," + (mainHeight + m[0]) + ")")
    .attr("width", w)
    .attr("height", miniHeight)
    .attr("class", "mini");

  //main lanes and texts

  //mini lanes and texts
  mini.append("g").selectAll(".laneLines")
    .data(items)
    .enter().append("line")
    .attr("x1", m[1])
    .attr("x2", w)
    .attr("y2", function (d) { return y2(d.lane); })
    .attr("stroke", "lightgray");

  mini.append("g").selectAll(".laneText")
    .data(lanes)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", -m[1])
    .attr("y", function (d, i) { return y2(i + .5); })
    .attr("dy", ".5ex")
    .attr("text-anchor", "end")
    .attr("class", "laneText");

  var itemRects = main.append("g")
    .attr("clip-path", "url(#clip)");

  //mini item rects
  mini.append("g").selectAll("miniItems")
    .data(items)
    .enter().append("rect")
    .attr("class", function (d) { return "miniItem" + d.lane; })
    .attr("x", function (d) { return x(d.start); })
    .attr("y", function (d) { return y2(d.lane + .5) - 5; })
    .attr("width", function (d) { return x(d.end - d.start); })
    .attr("height", 10);

  //mini labels
  mini.append("g").selectAll(".miniLabels")
    .data(items)
    .enter().append("text")
    .text(function (d) { return d.id; })
    .attr("x", function (d) { return x(d.start); })
    .attr("y", function (d) { return y2(d.lane + .5); })
    .attr("dy", ".5ex");

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
      .data(visItems, function (d) { return d.id; })
      .attr("x", function (d) { return x1(d.start); })
      .attr("width", function (d) { return x1(d.end) - x1(d.start); });

    rects.enter().append("rect")
      .attr("class", function (d) { return "miniItem" + d.lane; })
      .attr("x", function (d) { return x1(d.start); })
      .attr("width", function (d) { return x1(d.end) - x1(d.start); })

    rects.exit().remove();

    //update the item labels
    labels = itemRects.selectAll("text")
      .data(visItems, function (d) { return d.id; })
      .attr("x", function (d) { return x1(Math.max(d.start, minExtent) + 2); });

    labels.enter().append("text")
      .text(function (d) { return d.id; })
      .attr("x", function (d) { return x1(Math.max(d.start, minExtent)); })
      .attr("text-anchor", "start");

    labels.exit().remove();

  }
  return <svg className={[styles.chart, styles.main].join(' ')} ref={ref}></svg>;
}
export default Timeline

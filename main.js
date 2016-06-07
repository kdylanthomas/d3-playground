'use strict';

// *********
// BAR CHART
// *********

let w = 500;
let h = 150;
let barPadding = 1;
let dataset = [];

for (let i = 0; i < 25; i++) {
	l[ 330,   95 ],
                  [ 410,   12 ],
                  [ 475,   44 ],
                  [ 25,    67 ],
                  [ 85,    21 ],
                  [ 220,   88 ]et newNum = Math.floor(Math.random() * 30);
	dataset.push(newNum);
}

let svg = d3.select('#bar-chart').append('svg')
	.attr('width', w)
	.style('height', h);

svg.selectAll('rect')
	.data(dataset)
	.enter()
	.append('rect')
	.attr({
		x: (d, i) => i * (w / dataset.length),
	  y: d => h - (d * 4),
	 	width: w / dataset.length - barPadding,
	  height: d => d * 4,
		fill: d => `rgba(160,0,128,${d/100 * 3})`
	});

svg.selectAll('text')
	.data(dataset)
	.enter()
	.append('text')
	.text(d => d)
	.attr({
		'font-size': '11px',
		'text-anchor': 'middle',
		x: (d, i) => i * (w / dataset.length) + (w / dataset.length - barPadding) / 2,
		y: d => h - (d * 4) + 15
	});

// ***********
// SCATTERPLOT
// ***********

let scatterplotData = [
	[5, 20],
	[480, 90],
	[250, 50],
	[100, 33],
	[330, 95],
  [410, 12],
  [475, 44],
  [25, 67],
  [85, 21],
  [220, 88]
]

let scatterplotSvg = d3.select('#scatterplot').append('svg')
					.attr({width: w, height: h});

scatterplotSvg.selectAll('circle')
					.data(scatterplotData)
					.enter()
					.append('circle')
					.attr({
						cx: d => d[0],
						cy: d => d[1],
						r: d => Math.sqrt(h - d[1]), // circles w/ greater y vals have smaller areas
						fill: 'teal'
					});

scatterplotSvg.selectAll('text')
					.data(scatterplotData)
					.enter()
					.append('text')
					.text(d => `${d[0]}, ${d[1]}`)
					.attr({
						x: d => d[0],
						y: d => d[1],
						'font-size': '11px',
						'fill': '#3F3F3F'
					});

// **********
// CIRCLE SVG
// **********

let circleData = [5, 10, 15, 20, 25];

let circleSvg = d3.select('#circles').append('svg')
					.attr('width', w)
					.attr('height', h);

let circles = circleSvg.selectAll('circle')
				  .data(circleData)
				  .enter()
				  .append('circle')
				  .attr('cx', (d, i) => (i * 50) + 25)
				  .attr('cy', h/2)
				  .attr('r', d => d)
				  .attr("fill", "yellow")
					.attr("stroke", "orange")
					.attr("stroke-width", d => d / 2);
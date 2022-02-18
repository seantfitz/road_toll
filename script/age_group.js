let _margin = 0
let _height = 150// - _margin.top - _margin.bottom;
let _width = 340// - _margin.left - _margin.right;

let colours = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]

let cols = [
	'#fc0',
	'#f70',
	'#f00',
	'#707',
	'#0af',
	'#0a0',
	'#000'
]

const age_group_chart = (data)=>{
// console.log(data)
	const radius = Math.min(_width, _height) / 2 - _margin

	// set the color scale
	const color = d3.scaleOrdinal()
		.range(cols)

	// Compute the position of each group on the pie:
	const pie = d3.pie()
		.value(d=>d[1])
		
	const data_ready = pie(Object.entries(data))

	// append the svg object to the div called 'my_dataviz'
	const container = d3.select("#age_group")
		.classed('container',true)
		.attr('font-family','Gilroy')
		.attr("width", _width)
		.attr("height", _height)

	const clear_chart = container.selectAll('*').remove();

	const chart = container.append("g")
		.attr("transform", `translate(${radius},${radius})`);

	// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
	const segments = chart
		.selectAll('.seg')
		.data(data_ready)
		.enter()
		.append('path')
		.classed('seg',true)
		.attr('d', d3.arc()
			.innerRadius(radius / 2)// This is the size of the donut hole
			.outerRadius(radius)
		)
		.attr('fill', d => color(d.data[0]))
		.on('mouseover',(d,i)=>{
			mid.text(i.data[1])
		})
		.on('mouseout',()=>{
			mid.text(null)
		})

	const mid = chart
		.selectAll('.mid')
		.data([{a:'aa'}])
		.enter()
		.append('text')
		.classed('mid',true)
		.attr('text-anchor','middle')
		.attr('x',0)
		.attr('y','0.35em')
		// .text(master.state[sel].years[yyyy].total)

	/*legend*/
	// again rebind for legend
	const legendG = container
		.selectAll('.legend')
		.data(data_ready)
		.enter()
		.append('g')
		.attr('transform',(d,i) => (`translate(${radius * 2 + 10},${i * 20 + 10})`))
		.classed('legend',true)

	legendG.append("rect") // make a matching color rect
		.attr('width', '1em')
		.attr('height', '1em')
		.attr('fill', d => color(d.data[0]))

		.on('mouseover',(d,i)=>{
			mid.text(i.data[1])
		})
		.on('mouseout',()=>{
			mid.text(null)
			// mid.text(master.state[sel].years[yyyy].total)
		})

	legendG.append('text') // add the text
		.text(d => (`${d.data[0].replace(/_/g,' ')}`))
		// .text(d => (`${d.data[0].replace(/_/g,' ')}: ${d.data[1]}`))
		.attr('y', '0.9em')
		.attr('x', '1.5em')
		.on('mouseover',(d,i)=>{
			mid.text(i.data[1])
			// mid.text(master.state[sel].years[yyyy].total)
		})
		.on('mouseout',()=>{
			mid.text(null)
			// mid.text(master.state[sel].years[yyyy].total)
		})

	// legendG.append('text') // add the text
	// 	.text(d => (`${d.data[0].replace(/_/g,' ')}`))
	// 	// .text(d => (`${d.data[0].replace(/_/g,' ')}: ${d.data[1]}`))
	// 	.attr('y', '0.9em')
	// 	.attr('x', _width)
	// 	.attr('text-anchor','end')
	// 	.on('mouseover',(d,i)=>{
	// 		mid.text(i.data[1])
	// 		// mid.text(master.state[sel].years[yyyy].total)
	// 	})
	// 	.on('mouseout',()=>{
	// 		mid.text(null)
	// 		// mid.text(master.state[sel].years[yyyy].total)
	// 	})


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
};

//https://www.d3-graph-gallery.com/graph/donut_basic.html
//https://stackoverflow.com/questions/32298837/how-to-add-a-nice-legend-to-a-d3-pie-chart
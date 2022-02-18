const donut = (data,id,head,cols)=>{
// console.log(id)
	let keys = Object.keys(data)

	for(i of keys){
		if(data[i] == 0){
			delete data[i]
		}
	}

	const mrgn = [26,0,0,0]
	const wdth = 100
	const hght = 180

	const radius = Math.min(wdth,hght) / 2// - Math.min(...mrgn)

	// const color = d3.scaleOrdinal().range(['#000','#F00','#fc0'])
	const color = d3.scaleOrdinal().range(cols)

	const pie = d3.pie().value(d=>d[1])
		
	const data_ready = pie(Object.entries(data))

	const container = d3.select(`#${id}`)
		.classed('container',true)
		.attr('font-family','Gilroy')
		.attr("width", wdth)
		.attr("height", hght)

	const clear_chart = container.selectAll('*').remove();

	const chart = container.append("g")
		.attr("transform", `translate(${radius + mrgn[3]},${radius + mrgn[0]})`)
		.classed('donut',true)

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
		.text(null)

	const heading = chart
		.selectAll('.heading')
		.data([{a:'aa'}])
		.enter()
		.append('text')
		.classed('heading',true)
		.attr('text-anchor','middle')
		.attr('x',0)
		.attr('y', - radius - mrgn[0] / 2)
		.text(head)

	const legendG = container
		.selectAll('.legend')
		.data(data_ready)
		.enter()
		.append('g')
		// .attr('transform',(d,i) => (`translate(${10},${i * 16 + 10 + (radius * 2)})`))
		// .attr('transform',(d,i) => (`translate(${10},${i * 16 + 10 + mrgn[0] / 2 + (radius * 2)})`))
		.attr('transform',(d,i) => (`translate(${10},${i * 16 + mrgn[0] + (radius * 2)})`))
		.classed('legend',true)

	legendG.append("rect") // make a matching color rect
		.attr('width', '0.75em')
		.attr('height', '0.75em')
		.attr('fill', d => color(d.data[0]))

		.on('mouseover',(d,i)=>{
			mid.text(i.data[1])
		})
		.on('mouseout',()=>{
			mid.text(null)
		})

	legendG.append('text') // add the text
		.text(d => (toTitleCase(d.data[0].replace(/_/g,' '))))
		.attr('y', '0.9em')
		.attr('x', '1.5em')
		.style('font-size','0.75em')
		.on('mouseover',(d,i)=>{
			mid.text(i.data[1])
		})
		.on('mouseout',()=>{
			mid.text(null)
		})
}
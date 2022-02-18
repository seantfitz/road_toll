const make_chart_national = (yr,secondary)=>{

	/*reset to main*/
	d3.select('#state_list').property('value','national')

	d3.selectAll('.bar.selected').classed('selected',false)
	d3.selectAll('.bar').classed('unselected',false)

	d3.select('#locality_heading').html(`Australia - ${selected_year}`)
	d3.select('#total').html(`Total: ${master.national[selected_year].total}`)
	d3.select('#hols').html(`Christmas: ${master.national[selected_year].christmas} - Easter: ${master.national[selected_year].easter}`)
	
	if(secondary){
		age_group_chart(master.national[selected_year].age_group)

		donut(
			master.national[selected_year].gender,
			'gn',
			'Gender',
			['#0af','#e27','#333','#888']
		)
		fn_keys(
			donut,
			master.national[selected_year],
			['day','night'],
			'dn',
			'Time of Day',
			['#fc0','#004']
		)
		fn_keys(
			donut,
			master.national[selected_year],
			['weekday','weekend'],
			'we',
			'Day of Week',
			['#f50','#609']
		)
	}
	/*reset to main*/

	let margin = {
		top: 60,
		right: 30,
		bottom: 30,
		left: 30
	};

	let width = 500 - margin.left - margin.right;
	let height = 320 - margin.top - margin.bottom;

	let keys = Object.keys(master.national[yr].month)
	let obj = master.national[yr].month
	let d = []
	let max = 0;

	let this_year = master.national[yr]

	for(let i of keys){
		d.push(obj[i])
		if(obj[i].total >= max){
			max = obj[i].total
		}
	}

	const xScale = d3
		.scaleBand()
		.domain(d.map((dataPoint) => dataPoint.month))
		.rangeRound([0,width])
		.padding(0.1);//10%

	const yScale = d3
		.scaleLinear()
		.domain([0,round_up(max)])
		.range([height,0]);

	const container = d3.select('#states')
		.classed('container',true)
		.attr('font-family','Gilroy')
		.attr('width',width + margin.left + margin.right)
		.attr('height',height + margin.top + margin.bottom)
		.attr("viewBox", [-margin.left, 0, width + margin.left + margin.right, height]);

	const clear_chart = container.selectAll('*').remove();

	const chart = container.append('g');

	const bars = chart
		.selectAll('.bar')
		.data(d, data => data)
		.enter()//check for what's not there yet
		.append('rect')//standard svg element
		.classed(`bar`,true)
		.attr('width', xScale.bandwidth())
		.attr('height', data => height - yScale(data.total))
		.attr('x', data => xScale(data.month))
		.attr('y', data => yScale(data.total))
		.on('click',(d,i)=>{
			//select and deselect a month
			if(d3.select(d.target).classed('selected')){
				d3.selectAll('.bar').classed('unselected',false)
				d3.select(d.target).classed('selected',false)
				
				age_group_chart(master.national[selected_year].age_group)

				donut(
					master.national[selected_year].gender,
					'gn',
					'Gender',
					['#0af','#e27','#333','#888']
				)
				fn_keys(
					donut,
					master.national[selected_year],
					['day','night'],
					'dn',
					'Time of Day',
					['#fc0','#004']
				)
				fn_keys(
					donut,
					master.national[selected_year],
					['weekday','weekend'],
					'we',
					'Day of Week',
					['#f50','#609']
				)

				d3.select('#locality_heading').html(`Australia - ${selected_year}`)
				d3.select('#total').html(`Total: ${master.national[selected_year].total}`)
				d3.select('#hols').html(`Christmas: ${master.national[selected_year].christmas} - Easter: ${master.national[selected_year].easter}`)
			}else{
				d3.selectAll('.bar.selected').classed('selected',false)
				d3.selectAll('.bar').classed('unselected',true)
				d3.select(d.target).classed('selected',true)
				
				age_group_chart(i.age_group)

				donut(
					i.gender,
					'gn',
					'Gender',
					['#0af','#e27','#333','#888']
				)
				fn_keys(
					donut,
					i,
					['day','night'],
					'dn',
					'Time of Day',
					['#fc0','#004']
				)
				fn_keys(
					donut,
					i,
					['weekday','weekend'],
					'we',
					'Day of Week',
					['#f50','#609']
				)

				d3.select('#locality_heading').html(`Australia - ${i.month} ${selected_year}`)
				d3.select('#total').html(`Total: ${i.total}`)
				d3.select('#hols').html(``)
			}
		})

	const labels = chart
		.selectAll('.label')
		.data(d, data => data)
		.enter()
		.append('text')
		.text(data => (data.total))
		.attr('x', (data => xScale(data.month) + (xScale.bandwidth() / 2)))
		.attr('y', data => yScale(data.total) - 10)
		.attr('text-anchor','middle')
		.classed('label',true)

	const axisX = chart.append('g')
		.call(d3.axisBottom(xScale).tickSizeOuter(0))
		.attr('transform',`translate(0,${height})`)
		.classed('axisX',true)

	const yAxisTicks = yScale.ticks()
		.filter(tick => Number.isInteger(tick))

	const axisY = chart.append('g')
		.call(
			d3
			.axisLeft(yScale)
			.tickValues(yAxisTicks)
			.tickFormat(d3.format('d'))
		)
		.classed('axisY',true)

	const heading = chart
		.selectAll('.heading')
		.data([{a:1}])
		.enter()
		.append('text')
		.classed('heading',true)
		.text(`Australia - ${selected_year}`)
		.attr('transform','translate(-20,-20)')
}

d3.select('#national').on('click',()=>{
	selected_state = 'national'
	make_chart_national(selected_year,true)
})
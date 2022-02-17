/*GENERAL PAGE SETUP*/
//function to get query string parameters
const getQueryParams = (qs)=>{
	qs = qs.split('+').join(' ');

	let params = {},
	tokens,
	re = /[?&]?([^=]+)=([^&]*)/g;

	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}
	return params;
};

//query string parameters as a variable
let query = getQueryParams(document.location.search)

let selected_state = 'ACT'
if(query['state']){
	selected_state = query['state']
}

let selected_lga = 'Adelaide (C)'
if(query['lga']){
	selected_lga = query['lga']
}

let selected_year = 2021;

// console.log(query)

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// let margin = {
// 	top: 30,
// 	right: 30,
// 	bottom: 30,
// 	left: 30
// };
// const width = 870 - margin.left - margin.right;
// const height = 400 - margin.top - margin.bottom;

// let width = 500 - margin.left - margin.right;
// let height = 285 - margin.top - margin.bottom;

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

let master = {
	national:{},
	state:{},
	lga:{}
}

const add = (bool)=>{
	if(bool){
		return 1
	}else{
		return 0
	}
}

const doSomething = ()=>{

	let latest_year = 0;
	// d3.csv('script/toll.csv',(d)=>{//v7
	d3.csv('script/ardd_fatalities_dec2021.csv',(d)=>{//v7

		let Crash_ID = d['Crash ID']

		let State = d['State']
		let Year = d['Year']
		let Month = d['Month']

		let Dayweek = d['Dayweek']
		let Crash_Type = d['Crash Type']

		let Bus = d['Bus Involvement']
		let Heavy_Rigid = d['Heavy Rigid Truck Involvement']
		let Articulated = d['Articulated Truck Involvement']
		
		let Speed_Limit = d['Speed Limit']
		let Road_User = d['Road User']
		let Gender = d['Gender']
		
		let LGA = d['National LGA Name 2017']

		if(LGA == ''){
			LGA = 'Unspecified'
		}
		
		let Road_Type = d['National Road Type']
		
		/*boolean*/
		let Christmas = d['Christmas Period']
		let Easter = d['Easter Period']
		/*boolean*/
		
		let Age_Group = d['Age Group']
		
		/*boolean*/
		let Day_of_Week = d['Day of week']//weekday / weekend
		let Time_of_Day = d['Time of day']//day / night
		/*boolean*/

		if(Number(Year) > latest_year){
			latest_year = Year;
		}

		/*national*/
		if(!master.national[Year]){
			
			master.national[Year] = {
				total:add(Crash_ID != ''),

				christmas:add(Christmas == 'Yes'),
				easter:add(Easter == 'Yes'),
				
				weekday:add(Day_of_Week == 'Weekday'),
				weekend:add(Day_of_Week == 'Weekend'),
				
				day:add(Time_of_Day == 'Day'),
				night:add(Time_of_Day == 'Night'),

				month:{},

				age_group:{
					"0_to_16":add(Age_Group == '0_to_16'),
					"17_to_25":add(Age_Group == '17_to_25'),
					"26_to_39":add(Age_Group == '26_to_39'),
					"40_to_64":add(Age_Group == '40_to_64'),
					"65_to_74":add(Age_Group == '65_to_74' ),
					"75_or_older":add(Age_Group == '75_or_older'),
					unknown:add(Age_Group == '-9')
				},

				gender:{
					male:add(Gender == 'Male'),
					female:add(Gender == 'Female'),
					unspecified:add(Gender == 'Unspecified'),
					unknown:add(Gender == '-9')
				}
			}
		}else{
			master.national[Year].total += add(Crash_ID != '')
			master.national[Year].christmas += add(Christmas == 'Yes')
			master.national[Year].easter += add(Easter == 'Yes')
			master.national[Year].weekday += add(Day_of_Week == 'Weekday')
			master.national[Year].weekend += add(Day_of_Week == 'Weekend')
			master.national[Year].day += add(Time_of_Day == 'Day')
			master.national[Year].night += add(Time_of_Day == 'Night')

			master.national[Year].age_group['0_to_16'] += add(Age_Group == '0_to_16')
			master.national[Year].age_group['17_to_25'] += add(Age_Group == '17_to_25')
			master.national[Year].age_group['26_to_39'] += add(Age_Group == '26_to_39')
			master.national[Year].age_group['40_to_64'] += add(Age_Group == '40_to_64')
			master.national[Year].age_group['65_to_74'] += add(Age_Group =='65_to_74' )
			master.national[Year].age_group['75_or_older'] += add(Age_Group == '75_or_older')
			master.national[Year].age_group['unknown'] += add(Age_Group == '-9')
			
			master.national[Year].gender['male'] += add(Gender == 'Male')
			master.national[Year].gender['female'] += add(Gender == 'Female')
			master.national[Year].gender['unspecified'] += add(Gender == 'Unspecified')
			master.national[Year].gender['unknown'] += add(Gender == '-9')
		}

		if(!master.national[Year].month[Month]){
			master.national[Year].month[Month] = {
				total:add(Crash_ID != ''),

				weekday:add(Day_of_Week == 'Weekday'),
				weekend:add(Day_of_Week == 'Weekend'),

				day:add(Time_of_Day == 'Day'),
				night:add(Time_of_Day == 'Night'),

				age_group:{
					"0_to_16":add(Age_Group == '0_to_16'),
					"17_to_25":add(Age_Group == '17_to_25'),
					"26_to_39":add(Age_Group == '26_to_39'),
					"40_to_64":add(Age_Group == '40_to_64'),
					"65_to_74":add(Age_Group == '65_to_74' ),
					"75_or_older":add(Age_Group == '75_or_older'),
					unknown:add(Age_Group == '-9')
				},

				gender:{
					male:add(Gender == 'Male'),
					female:add(Gender == 'Female'),
					unspecified:add(Gender == 'Unspecified'),
					unknown:add(Gender == '-9')
				}
			}
		}else{
			master.national[Year].month[Month].total += add(Crash_ID != '')
			master.national[Year].month[Month].weekday += add(Day_of_Week == 'Weekday')
			master.national[Year].month[Month].weekend += add(Day_of_Week == 'Weekend')
			master.national[Year].month[Month].day += add(Time_of_Day == 'Day')
			master.national[Year].month[Month].night += add(Time_of_Day == 'Night')

			master.national[Year].month[Month].age_group['0_to_16'] += add(Age_Group == '0_to_16')
			master.national[Year].month[Month].age_group['17_to_25'] += add(Age_Group == '17_to_25')
			master.national[Year].month[Month].age_group['26_to_39'] += add(Age_Group == '26_to_39')
			master.national[Year].month[Month].age_group['40_to_64'] += add(Age_Group == '40_to_64')
			master.national[Year].month[Month].age_group['65_to_74'] += add(Age_Group =='65_to_74' )
			master.national[Year].month[Month].age_group['75_or_older'] += add(Age_Group == '75_or_older')
			master.national[Year].month[Month].age_group['unknown'] += add(Age_Group == '-9')

			master.national[Year].month[Month].gender['male'] += add(Gender == 'Male')
			master.national[Year].month[Month].gender['female'] += add(Gender == 'Female')
			master.national[Year].month[Month].gender['unspecified'] += add(Gender == 'Unspecified')
			master.national[Year].month[Month].gender['unknown'] += add(Gender == '-9')
		}
		/*national*/

		/*state*/
		if(!master.state[State]){
			master.state[State] = {
				years:{}
			}
		}

		if(!master.state[State].years[Year]){
			
			master.state[State].years[Year] = {
				total:add(Crash_ID != ''),

				christmas:add(Christmas == 'Yes'),
				easter:add(Easter == 'Yes'),
				
				weekday:add(Day_of_Week == 'Weekday'),
				weekend:add(Day_of_Week == 'Weekend'),
				
				day:add(Time_of_Day == 'Day'),
				night:add(Time_of_Day == 'Night'),

				month:{
					"1":{month:"Jan",total:0,weekday:0,weekend:0,day:0,night:0,age_group:{"0_to_16":0,"17_to_25":0,"26_to_39":0,"40_to_64":0,"65_to_74":0,"75_or_older":0,unknown:0},gender:{male:0,female:0,unspecified:0,unknown:0}},
					"2":{month:"Feb",total:0,weekday:0,weekend:0,day:0,night:0,age_group:{"0_to_16":0,"17_to_25":0,"26_to_39":0,"40_to_64":0,"65_to_74":0,"75_or_older":0,unknown:0},gender:{male:0,female:0,unspecified:0,unknown:0}},
					"3":{month:"Mar",total:0,weekday:0,weekend:0,day:0,night:0,age_group:{"0_to_16":0,"17_to_25":0,"26_to_39":0,"40_to_64":0,"65_to_74":0,"75_or_older":0,unknown:0},gender:{male:0,female:0,unspecified:0,unknown:0}},
					"4":{month:"Apr",total:0,weekday:0,weekend:0,day:0,night:0,age_group:{"0_to_16":0,"17_to_25":0,"26_to_39":0,"40_to_64":0,"65_to_74":0,"75_or_older":0,unknown:0},gender:{male:0,female:0,unspecified:0,unknown:0}},
					"5":{month:"May",total:0,weekday:0,weekend:0,day:0,night:0,age_group:{"0_to_16":0,"17_to_25":0,"26_to_39":0,"40_to_64":0,"65_to_74":0,"75_or_older":0,unknown:0},gender:{male:0,female:0,unspecified:0,unknown:0}},
					"6":{month:"Jun",total:0,weekday:0,weekend:0,day:0,night:0,age_group:{"0_to_16":0,"17_to_25":0,"26_to_39":0,"40_to_64":0,"65_to_74":0,"75_or_older":0,unknown:0},gender:{male:0,female:0,unspecified:0,unknown:0}},
					"7":{month:"Jul",total:0,weekday:0,weekend:0,day:0,night:0,age_group:{"0_to_16":0,"17_to_25":0,"26_to_39":0,"40_to_64":0,"65_to_74":0,"75_or_older":0,unknown:0},gender:{male:0,female:0,unspecified:0,unknown:0}},
					"8":{month:"Aug",total:0,weekday:0,weekend:0,day:0,night:0,age_group:{"0_to_16":0,"17_to_25":0,"26_to_39":0,"40_to_64":0,"65_to_74":0,"75_or_older":0,unknown:0},gender:{male:0,female:0,unspecified:0,unknown:0}},
					"9":{month:"Sep",total:0,weekday:0,weekend:0,day:0,night:0,age_group:{"0_to_16":0,"17_to_25":0,"26_to_39":0,"40_to_64":0,"65_to_74":0,"75_or_older":0,unknown:0},gender:{male:0,female:0,unspecified:0,unknown:0}},
					"10":{month:"Oct",total:0,weekday:0,weekend:0,day:0,night:0,age_group:{"0_to_16":0,"17_to_25":0,"26_to_39":0,"40_to_64":0,"65_to_74":0,"75_or_older":0,unknown:0},gender:{male:0,female:0,unspecified:0,unknown:0}},
					"11":{month:"Nov",total:0,weekday:0,weekend:0,day:0,night:0,age_group:{"0_to_16":0,"17_to_25":0,"26_to_39":0,"40_to_64":0,"65_to_74":0,"75_or_older":0,unknown:0},gender:{male:0,female:0,unspecified:0,unknown:0}},
					"12":{month:"Dec",total:0,weekday:0,weekend:0,day:0,night:0,age_group:{"0_to_16":0,"17_to_25":0,"26_to_39":0,"40_to_64":0,"65_to_74":0,"75_or_older":0,unknown:0},gender:{male:0,female:0,unspecified:0,unknown:0}}
				},

				age_group:{
					"0_to_16":add(Age_Group == '0_to_16'),
					"17_to_25":add(Age_Group == '17_to_25'),
					"26_to_39":add(Age_Group == '26_to_39'),
					"40_to_64":add(Age_Group == '40_to_64'),
					"65_to_74":add(Age_Group == '65_to_74' ),
					"75_or_older":add(Age_Group == '75_or_older'),
					unknown:add(Age_Group == '-9')
				},

				gender:{
					male:add(Gender == 'Male'),
					female:add(Gender == 'Female'),
					unspecified:add(Gender == 'Unspecified'),
					unknown:add(Gender == '-9')
				}
			}
		}else{
			master.state[State].years[Year].total += add(Crash_ID != '')
			master.state[State].years[Year].christmas += add(Christmas == 'Yes')
			master.state[State].years[Year].easter += add(Easter == 'Yes')
			master.state[State].years[Year].weekday += add(Day_of_Week == 'Weekday')
			master.state[State].years[Year].weekend += add(Day_of_Week == 'Weekend')
			master.state[State].years[Year].day += add(Time_of_Day == 'Day')
			master.state[State].years[Year].night += add(Time_of_Day == 'Night')

			master.state[State].years[Year].age_group['0_to_16'] += add(Age_Group == '0_to_16')
			master.state[State].years[Year].age_group['17_to_25'] += add(Age_Group == '17_to_25')
			master.state[State].years[Year].age_group['26_to_39'] += add(Age_Group == '26_to_39')
			master.state[State].years[Year].age_group['40_to_64'] += add(Age_Group == '40_to_64')
			master.state[State].years[Year].age_group['65_to_74'] += add(Age_Group =='65_to_74' )
			master.state[State].years[Year].age_group['75_or_older'] += add(Age_Group == '75_or_older')
			master.state[State].years[Year].age_group['unknown'] += add(Age_Group == '-9')
			
			master.state[State].years[Year].gender['male'] += add(Gender == 'Male')
			master.state[State].years[Year].gender['female'] += add(Gender == 'Female')
			master.state[State].years[Year].gender['unspecified'] += add(Gender == 'Unspecified')
			master.state[State].years[Year].gender['unknown'] += add(Gender == '-9')
		}

		if(!master.state[State].years[Year].month[Month]){
			// console.log(State,Year,Month)
			master.state[State].years[Year].month[Month] = {
				month:months[Number(Month) - 1],
				total:add(Crash_ID != ''),

				weekday:add(Day_of_Week == 'Weekday'),
				weekend:add(Day_of_Week == 'Weekend'),

				day:add(Time_of_Day == 'Day'),
				night:add(Time_of_Day == 'Night'),

				age_group:{
					"0_to_16":add(Age_Group == '0_to_16'),
					"17_to_25":add(Age_Group == '17_to_25'),
					"26_to_39":add(Age_Group == '26_to_39'),
					"40_to_64":add(Age_Group == '40_to_64'),
					"65_to_74":add(Age_Group == '65_to_74' ),
					"75_or_older":add(Age_Group == '75_or_older'),
					unknown:add(Age_Group == '-9')
				},

				gender:{
					male:add(Gender == 'Male'),
					female:add(Gender == 'Female'),
					unspecified:add(Gender == 'Unspecified'),
					unknown:add(Gender == '-9')
				}
			}
		}else{
			master.state[State].years[Year].month[Month].total += add(Crash_ID != '')
			master.state[State].years[Year].month[Month].weekday += add(Day_of_Week == 'Weekday')
			master.state[State].years[Year].month[Month].weekend += add(Day_of_Week == 'Weekend')
			master.state[State].years[Year].month[Month].day += add(Time_of_Day == 'Day')
			master.state[State].years[Year].month[Month].night += add(Time_of_Day == 'Night')

			master.state[State].years[Year].month[Month].age_group['0_to_16'] += add(Age_Group == '0_to_16')
			master.state[State].years[Year].month[Month].age_group['17_to_25'] += add(Age_Group == '17_to_25')
			master.state[State].years[Year].month[Month].age_group['26_to_39'] += add(Age_Group == '26_to_39')
			master.state[State].years[Year].month[Month].age_group['40_to_64'] += add(Age_Group == '40_to_64')
			master.state[State].years[Year].month[Month].age_group['65_to_74'] += add(Age_Group =='65_to_74' )
			master.state[State].years[Year].month[Month].age_group['75_or_older'] += add(Age_Group == '75_or_older')
			master.state[State].years[Year].month[Month].age_group['unknown'] += add(Age_Group == '-9')

			master.state[State].years[Year].month[Month].gender['male'] += add(Gender == 'Male')
			master.state[State].years[Year].month[Month].gender['female'] += add(Gender == 'Female')
			master.state[State].years[Year].month[Month].gender['unspecified'] += add(Gender == 'Unspecified')
			master.state[State].years[Year].month[Month].gender['unknown'] += add(Gender == '-9')
		}
		/*state*/

		/*lga*/
		if(!master.lga[LGA]){
			master.lga[LGA] = {
				state:State,
				years:{}
			}
		}

		for(let i = latest_year; i > Number(Year); i--){
			if(!master.lga[LGA].years[i]){
				master.lga[LGA].years[i] = {
						year:i.toString(),
						total:0,
						christmas:0,
						easter:0,
						weekday:0,
						weekend:0,
						day:0,
						night:0,
						month:{},
						age_group:{
							"0_to_16":0,
							"17_to_25":0,
							"26_to_39":0,
							"40_to_64":0,
							"65_to_74":0,
							"75_or_older":0,
							unknown:0
						},
						gender:{
							male:0,
							female:0,
							unspecified:0,
							unknown:0
						}
					}
			}
		}

		if(!master.lga[LGA].years[Year]){
			master.lga[LGA].years[Year] = {
				year:Year,
				total:add(Crash_ID != ''),

				christmas:add(Christmas == 'Yes'),
				easter:add(Easter == 'Yes'),
				
				weekday:add(Day_of_Week == 'Weekday'),
				weekend:add(Day_of_Week == 'Weekend'),
				
				day:add(Time_of_Day == 'Day'),
				night:add(Time_of_Day == 'Night'),

				month:{},

				age_group:{
					"0_to_16":add(Age_Group == '0_to_16'),
					"17_to_25":add(Age_Group == '17_to_25'),
					"26_to_39":add(Age_Group == '26_to_39'),
					"40_to_64":add(Age_Group == '40_to_64'),
					"65_to_74":add(Age_Group == '65_to_74' ),
					"75_or_older":add(Age_Group == '75_or_older'),
					unknown:add(Age_Group == '-9')
				},

				gender:{
					male:add(Gender == 'Male'),
					female:add(Gender == 'Female'),
					unspecified:add(Gender == 'Unspecified'),
					unknown:add(Gender == '-9')
				}
			}
		}else{
			master.lga[LGA].years[Year].total += add(Crash_ID != '')
			master.lga[LGA].years[Year].christmas += add(Christmas == 'Yes')
			master.lga[LGA].years[Year].easter += add(Easter == 'Yes')
			master.lga[LGA].years[Year].weekday += add(Day_of_Week == 'Weekday')
			master.lga[LGA].years[Year].weekend += add(Day_of_Week == 'Weekend')
			master.lga[LGA].years[Year].day += add(Time_of_Day == 'Day')
			master.lga[LGA].years[Year].night += add(Time_of_Day == 'Night')

			master.lga[LGA].years[Year].age_group['0_to_16'] += add(Age_Group == '0_to_16')
			master.lga[LGA].years[Year].age_group['17_to_25'] += add(Age_Group == '17_to_25')
			master.lga[LGA].years[Year].age_group['26_to_39'] += add(Age_Group == '26_to_39')
			master.lga[LGA].years[Year].age_group['40_to_64'] += add(Age_Group == '40_to_64')
			master.lga[LGA].years[Year].age_group['65_to_74'] += add(Age_Group =='65_to_74' )
			master.lga[LGA].years[Year].age_group['75_or_older'] += add(Age_Group == '75_or_older')
			master.lga[LGA].years[Year].age_group['unknown'] += add(Age_Group == '-9')
			
			master.lga[LGA].years[Year].gender['male'] += add(Gender == 'Male')
			master.lga[LGA].years[Year].gender['female'] += add(Gender == 'Female')
			master.lga[LGA].years[Year].gender['unspecified'] += add(Gender == 'Unspecified')
			master.lga[LGA].years[Year].gender['unknown'] += add(Gender == '-9')
		}

		if(!master.lga[LGA].years[Year].month[Month]){
			master.lga[LGA].years[Year].month[Month] = {
				total:add(Crash_ID != ''),

				weekday:add(Day_of_Week == 'Weekday'),
				weekend:add(Day_of_Week == 'Weekend'),

				day:add(Time_of_Day == 'Day'),
				night:add(Time_of_Day == 'Night'),

				age_group:{
					"0_to_16":add(Age_Group == '0_to_16'),
					"17_to_25":add(Age_Group == '17_to_25'),
					"26_to_39":add(Age_Group == '26_to_39'),
					"40_to_64":add(Age_Group == '40_to_64'),
					"65_to_74":add(Age_Group == '65_to_74' ),
					"75_or_older":add(Age_Group == '75_or_older'),
					unknown:add(Age_Group == '-9')
				},

				gender:{
					male:add(Gender == 'Male'),
					female:add(Gender == 'Female'),
					unspecified:add(Gender == 'Unspecified'),
					unknown:add(Gender == '-9')
				}
			}
		}else{
			master.lga[LGA].years[Year].month[Month].total += add(Crash_ID != '')
			master.lga[LGA].years[Year].month[Month].weekday += add(Day_of_Week == 'Weekday')
			master.lga[LGA].years[Year].month[Month].weekend += add(Day_of_Week == 'Weekend')
			master.lga[LGA].years[Year].month[Month].day += add(Time_of_Day == 'Day')
			master.lga[LGA].years[Year].month[Month].night += add(Time_of_Day == 'Night')

			master.lga[LGA].years[Year].month[Month].age_group['0_to_16'] += add(Age_Group == '0_to_16')
			master.lga[LGA].years[Year].month[Month].age_group['17_to_25'] += add(Age_Group == '17_to_25')
			master.lga[LGA].years[Year].month[Month].age_group['26_to_39'] += add(Age_Group == '26_to_39')
			master.lga[LGA].years[Year].month[Month].age_group['40_to_64'] += add(Age_Group == '40_to_64')
			master.lga[LGA].years[Year].month[Month].age_group['65_to_74'] += add(Age_Group =='65_to_74' )
			master.lga[LGA].years[Year].month[Month].age_group['75_or_older'] += add(Age_Group == '75_or_older')
			master.lga[LGA].years[Year].month[Month].age_group['unknown'] += add(Age_Group == '-9')

			master.lga[LGA].years[Year].month[Month].gender['male'] += add(Gender == 'Male')
			master.lga[LGA].years[Year].month[Month].gender['female'] += add(Gender == 'Female')
			master.lga[LGA].years[Year].month[Month].gender['unspecified'] += add(Gender == 'Unspecified')
			master.lga[LGA].years[Year].month[Month].gender['unknown'] += add(Gender == '-9')
		}
		/*lga*/
	})
	.then(()=>{

		// console.log(master)

		// console.log(JSON.stringify(master.lga['Adelaide (C)']))
		// console.log(master['state'][selected_state])
		// console.log(master['lga'][selected_lga])
		

		// window['data_state'] = master['state'][selected_state]
		// window['data_lga'] = master['lga'][selected_lga]
		// window['selected_state'] = 'ACT'
		// window['selected_year'] = latest_year
		// make_chart()
		lga_list()
		state_list()
		// year_list()
		// chart()


		// age_group_chart(selected_state,selected_year)
		age_group_chart(master.state[selected_state].years[selected_year].age_group)
	})
}

doSomething()

const lga_list = ()=>{
	let d = Object.keys(master.lga).sort();

	const listItems = d3
	.select('#lga_list')
	.on('change', (e)=>{
		make_chart(e.target.value)
	})
	.selectAll('option')
	.data(d)
	.enter()
	.append('option')
	.text(d => `${d}, ${master.lga[d].state}`)
	.attr('value',d => d)

	const setList = d3
	.select('#lga_list')
	.property('value',selected_lga)

	make_chart(selected_lga)
}

const state_list = ()=>{
	let d = Object.keys(master.state).sort()
	
	// window['selected_state'] = d[0]
	// console.log(d[0],selected_state)	
	const listItems = d3
	.select('#state_list')
	.on('change',(e)=>{
		selected_state = e.target.value
		make_chart_state(selected_state,selected_year)
		// age_group_chart(selected_state,selected_year)
		age_group_chart(master.state[selected_state].years[selected_year].age_group)
	})
	.selectAll('option')
	.data(d)
	.enter()
	.append('option')
	.text(d => d)
	.attr('value',d => d)

	const setList = d3
	.select('#state_list')
	.property('value',selected_state)

	// make_chart_state(selected_state,selected_year)
	year_list()
}

const year_list = ()=>{
	let d = Object.keys(master.national).reverse()

	// window['selected_year'] = d[0]
	// console.log(d[0],selected_year)
	const listItems = d3
	.select('#year_list')
	.on('change',(e)=>{
		selected_year = e.target.value
		make_chart_state(selected_state,selected_year)
		// age_group_chart(selected_state,selected_year)
		age_group_chart(master.state[selected_state].years[selected_year].age_group)
	})
	.selectAll('option')
	.data(d)
	.enter()
	.append('option')
	.text(d => d)
	.attr('value',d => d)
	// console.log(selected_state,selected_year)
	make_chart_state(selected_state,selected_year)
}

const round_up = (n)=>{

	let len = n.toString().length
	let first = Number(n.toString()[0])
	let step = 10;

	if(first < 5){
		step = 5;
	}

	let up = Number(step.toString().padEnd(len - 1, 0))
	return Math.floor(n / up) * up + up
}

const make_chart_state = (sel,yr)=>{

	let margin = {
		top: 60,
		right: 30,
		bottom: 30,
		left: 30
	};
	let width = 500 - margin.left - margin.right;
	// let height = 285 - margin.top - margin.bottom;
	let height = 320 - margin.top - margin.bottom;
// height=370
	// console.log(sel,yr)
	let keys = Object.keys(master.state[sel].years[yr].month)
	let obj = master.state[sel].years[yr].month
	let d = []
	let max = 0;

	let this_year = master.state[sel].years[yr]
	// console.log(this_year)
	// console.log(this_year.total)
	// console.log(this_year.christmas)
	// console.log(this_year.easter)

	// console.log(keys)
	// console.log(obj)

	for(let i of keys){
		d.push(obj[i])
		if(obj[i].total >= max){
			max = obj[i].total
		}
	}

	console.log(d)

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
		// .on('mouseover',(d,i)=>{
		// 	// console.log(i.age_group)
		// 	age_group_chart(i.age_group)
		// })
		// .on('mouseout',(d,i)=>{
		// 	age_group_chart(master.state[selected_state].years[selected_year].age_group)
		// })
		.on('click',(d,i)=>{
			console.log(d3.select(d.target).classed('selected'))
			
			if(d3.select(d.target).classed('selected')){
				d3.selectAll('#states .bar').classed('unselected',false)
				d3.select(d.target).classed('selected',false)
				age_group_chart(master.state[selected_state].years[selected_year].age_group)
			}else{
				d3.selectAll('#states .bar.selected').classed('selected',false)
				d3.selectAll('#states .bar').classed('unselected',true)
				d3.select(d.target).classed('selected',true)
				age_group_chart(i.age_group)
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
}

const make_chart = (sel)=>{
	let margin = {
		top: 60,
		right: 30,
		bottom: 30,
		left: 30
	};
	let width = 500 - margin.left - margin.right;
	let height = 200 - margin.top - margin.bottom;
// height=200
	let keys = Object.keys(master.lga[sel].years)
	let obj = master.lga[sel].years
	let d = []
	let max = 0;

	for(let i of keys){
		d.push(obj[i])
		if(obj[i].total >= max){
			max = obj[i].total
		}
	}

	const xScale = d3
		.scaleBand()
		.domain(d.map((dataPoint) => dataPoint.year))
		.rangeRound([0,width])
		.padding(0.1);//10%

	const yScale = d3
		.scaleLinear()
		.domain([0,round_up(max)])
		.range([height,0]);

	const container = d3.select('#lga')
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
		.attr('x', data => xScale(data.year))
		.attr('y', data => yScale(data.total))
		.on('mouseover',(d,i)=>{
			console.log(i)
			console.log(i)
		})

	const labels = chart
		.selectAll('.label')
		.data(d, data => data)
		.enter()
		.append('text')
		.text(data => (data.total))
		.attr('x', (data => xScale(data.year) + (xScale.bandwidth() / 2)))
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
}

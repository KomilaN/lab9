const data = d3.range(100).map(() => ({
	x: Math.random() * 500,
	y: Math.random() * 500,
}))

const scatterplotContainer = d3.select("#scatterplot").append("svg").attr("width", 600).attr("height", 500)

scatterplotContainer
	.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", d => d.x)
	.attr("cy", d => d.y)
	.attr("r", 5)
	.attr("fill", "blue")

d3.csv("titanic.csv")
	.then(data => {
		data.forEach(d => {
			d.Age = +d.Age
		})

		const ageGroups = d3.group(data, d => Math.floor(d.Age / 10) * 10)
		const ageDistribution = Array.from(ageGroups, ([key, value]) => ({ age: key, count: value.length }))

		const pieChartContainer = d3.select("#piechart").append("svg").attr("width", 400).attr("height", 300)

		const radius = 150
		const pie = d3.pie().value(d => d.count)
		const arc = d3.arc().innerRadius(0).outerRadius(radius)

		const pieChart = pieChartContainer.append("g").attr("transform", `translate(${radius}, ${radius})`)

		pieChart
			.selectAll("path")
			.data(pie(ageDistribution))
			.enter()
			.append("path")
			.attr("d", arc)
			.attr("fill", (d, i) => d3.schemeCategory10[i])
			.attr("stroke", "#fff")
			.attr("stroke-width", 1)

		const legend = pieChartContainer
			.selectAll(".legend")
			.data(ageDistribution)
			.enter()
			.append("g")
			.attr("class", "legend")
			.attr("transform", (d, i) => `translate(120, ${i * 20 + 200})`)

		legend
			.append("rect")
			.attr("x", 180)
			.attr("y", -radius)
			.attr("width", 18)
			.attr("height", 18)
			.attr("fill", (d, i) => d3.schemeCategory10[i])

		legend
			.append("text")
			.attr("x", 210)
			.attr("y", -radius + 9)
			.attr("dy", ".35em")
			.text(d => `${d.age}-${d.age + 9} years`)
			.style("font-size", "12px")
	})
	.catch(error => console.error(error))

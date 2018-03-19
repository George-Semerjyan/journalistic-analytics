//whenever the window resizes, call the handleResize function
d3.select(window).on('resize', handleResize);

//when the browser loads, loadChart() is called
loadChart();

function handleResize(){
    var svgArea = d3.select('svg');

    //if there is already an svg container on the page, remove it
    //and reload the chart
    if (!svgArea.empty()){
        svgArea.remove();
        loadChart();
    }
}

//load chart is called on page load when the window resizes
function loadChart() {
    //define SVG area dimensions
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
        top:25,
        bottom:50,
        left:100,
        right:100
    }

    var chartHeight = svgHeight - margin.top - margin.bottom
    var chartWidth = svgWidth - margin.left - margin.right

    var svg = d3
    .select('body')
    .append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    d3
    .select('.chart')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0.75);

    obese_list = []
    withDegree_list = []
    d3.csv('data.csv', function(error, csv_data){
        if (error) throw error

        csv_data.forEach(function(data){
            data.obese =+ data.obese;
            data.withDegree =+ data.withDegree;


            obese_list.push(data.obese)
            withDegree_list.push(data.withDegree)


        });

        console.log(csv_data)
        console.log(obese_list)
        console.log(withDegree_list)


        var yLinearScale = d3.scaleLinear().range([chartHeight,0]);
        var xLinearScale = d3.scaleLinear().range([0, chartWidth]);



        xLinearScale.domain([20,d3.max(csv_data, function(data){
            return +data.obese;
        })]);

        yLinearScale.domain([0,d3.max(csv_data, function(data){
            return +data.withDegree * 1.2;
        })]);


        var toolTip = d3
        .tip()
        .attr('class','tooltip')
        .offset([80,-60])
        .html(function(data){
            var state = data.state
            var obese =+data.obese
            var withDegree =+ data.withDegree
            return (state + '<br> education level:' + withDegree + '<br> obesity level:' + obese);
                });


        var chart = svg.append('g');
        chart.call(toolTip);

        chart
        .selectAll('circle')
        .data(csv_data)
        .enter()
        .append('circle')
            .attr('cx', function(data,index){
                console.log(data.obese);
                return xLinearScale(data.obese)
            })
            .attr('cy', function(data,index){
                return yLinearScale(data.withDegree)
            })
            .attr('r', '10')
            .attr('fill', 'darkred')
            .on('click', function(data){
                toolTip.show(data);
            })
            .on('mouseover', function(data){
                toolTip.show(data);
            })
            .on('mouseout', function(data){
                toolTip.hide(data);
            });

        chart
        .selectAll('text')
        .data(csv_data)
        .enter()
        .append('text')
        .attr('x', function(data,index){
            console.log(data.obese);
            return xLinearScale(data.obese)
        })
        .attr('y', function(data,index){
            return yLinearScale(data.withDegree)
        })
        .attr('text-anchor', 'middle')
        .attr('class', 'state')
        .style('fill', 'white')
        .style('font', '8px times-new-roman')
        .text(function(data){
            return data.abbr
        })
        .on('mouseover', function(data){
            toolTip.show(data)
        })
        .on('mouseout', function(data){
            toolTip.hide(data)
        })


    var bottomAxis = d3.axisBottom(xLinearScale)

    var leftAxis = d3.axisLeft(yLinearScale)

        chart.append('g')
        .attr('transform', 'translate(0,' + chartHeight + ')')
        .call(bottomAxis);

        chart.append('g')
        .call(leftAxis);




        chart
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left + 40)
        .attr('x', 0 - (chartHeight/2))
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .attr('data-axis-name', 'withDegree')
        .text('Education Levels');


        chart.append('text')
        .attr('transform', 'translate(' + (chartWidth/2) + ' ,' + (chartHeight + margin.top + 20) + ')')
        .attr('class', 'axisText active')
        .attr('data-axis-name', 'obese')
        .text('Obesity Prevalence')

    });

}

import React, { useState} from 'react';
import BarChart from './BarChart.jsx';
import './App.css';

function App() {
    const [data, setData] = useState([25,30,45,60,20,65,75]);
    // const svgRef = useRef();
    // useEffect(() => {
    //     console.log(svgRef);
    //     const svgD3 = select(svgRef.current);
        
        // svgD3
        //     .selectAll('circle')
        //     .data(data)
        //     .join(
        //         enter => enter.append('circle'),
        //         update => update.attr('class', 'updated')
        //         // exit => exit.remove()        // exit is default behavior
        //     )
        //     // .join('circle')                  // alt syntax if only doing simple circles
        //     .attr('r', v => v)
        //     .attr('cx', v => v * 2)
        //     .attr('cy', v => v * 2)
        //     .attr('stroke', 'red');

        ///////////////////// Curving Line Chart ////////////////

        // const xScale = scaleLinear().domain([0, data.length-1]).range([0, 300]);
        // const yScale = scaleLinear().domain([0, 75]).range([150, 0]);
        // const xAxis = axisBottom(xScale).ticks(data.length).tickFormat(i => i + 1);
        // const yAxis = axisRight(yScale);
 
        // svgD3.select('.x-axis').style('transform', 'translateY(150px)').call(xAxis);
        // svgD3.select('.y-axis').style('transform', 'translateX(300px)').call(yAxis);

        // const myLine = line().x((v,i) => xScale(i)).y(yScale).curve(curveCardinal);
        // // longer syntax .y(v => yScale(v))

        // svgD3
        //     .selectAll('.line')
        //     .data([data])
        //     .join('path')
        //     .attr('class', 'line')
        //     .attr('d', myLine)
        //     .attr('fill', 'none')
        //     .attr('stroke', 'blue')

        ///////////////////// Animated Bar Chart ////////////////////





    // },[data])

    return (
        <React.Fragment>
            <BarChart data={data}/>
            <button onClick={() => setData(data.map(v=>v+5))}>Update Data</button>
            <button onClick={() => setData(data.filter(v=>v<=35))}>Filter Data</button>
            <button onClick={() => setData([...data, Math.round(Math.random() * 150)])}>Add Data</button>
        </React.Fragment>
    );
}

export default App;

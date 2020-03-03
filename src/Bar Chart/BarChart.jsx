import React, { useRef, useEffect, useState } from "react";
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from "d3";
import ResizeObserver from "resize-observer-polyfill";
// polyfill necessary until edge and safari support it native

const useResizeObserver = ref => {
    const [dimensions, setDimensions] = useState(null);
    useEffect(() => {
        // called as soon as DOM is rendered, then every time dimensions changes
        const observeTarget = ref.current;
        const resizeObserver = new ResizeObserver(entries => {
            // entries = [   {contentRect: {height, width, etc} }   ]
            entries.forEach(e => { setDimensions(e.contentRect); });
        });
        resizeObserver.observe(observeTarget);
        return () => {
            resizeObserver.unobserve(observeTarget);
            // triggered when component is unmounted
        };
    }, [ref]);
    return dimensions;  // {height, width}
};

function BarChart({ data }) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    // wrapperRef is a div surrounding the svg because svg won't give
    // true dimensions in useResizeObserver
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(() => {
        // called as soon as DOM is rendered, then every time data or dimensions change
        const svg = select(svgRef.current);
        console.log(dimensions);
        if (!dimensions) return;
        const {height, width} = dimensions;
        const xScale = scaleBand()
            .domain(data.map((v, i) => i))
            .range([0, width])  // width of chart in pixels
            .padding(0.5);
        const yScale = scaleLinear()
            .domain([0, 150])       // min and max values of data being charted
            .range([height, 0]);    // height of chart in pixels
        const colorScale = scaleLinear().domain([75, 100, 150]).range(["green", "orange", "red"]).clamp(true);

        const xAxis = axisBottom(xScale).ticks(data.length);
        const yAxis = axisRight(yScale);
        svg.select(".x-axis").style("transform", `translateY(${height}px)`).call(xAxis);
        svg.select(".y-axis").style("transform", `translateX(${width}px)`).call(yAxis);
        
        svg.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .style('transform', 'scale(1,-1)') // to make it animate from the top upwards
            .attr("x", (value, index) => xScale(index))
            .attr("y", -height)
            .attr("width", xScale.bandwidth())
            .on("mouseenter", (value, index) => {
                svg.selectAll(".tooltip")
                    .data([value])
                    // .join('text')       // fall from top
                    .join(enter => enter.append("text").attr("y", yScale(value) - 4))
                    .attr("class", "tooltip")
                    .text(value)
                    .attr("x", xScale(index) + xScale.bandwidth() / 2)
                    .attr("text-anchor", "middle")
                    .transition()
                    .attr("y", yScale(value) - 8)
                    .attr("opacity", 1);
            })
            .on("mouseleave", () => svg.select(".tooltip").remove())
            .transition()
            .attr('text-anchor', 'middle')
            .attr("fill", colorScale)
            .attr("height", value => height - yScale(value));
    },
    [data, dimensions]
    );

    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </div>
    );
}

export default BarChart;
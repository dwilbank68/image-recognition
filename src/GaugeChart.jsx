import React, { useRef, useEffect, useState } from "react";
import { select, arc, pie, interpolate } from "d3";
import useResizeObserver from "./useResizeObserver.js";
// polyfill necessary until edge and safari support it native


function GaugeChart({ data }) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    // wrapperRef is a div surrounding the svg because svg won't give
    // true dimensions in useResizeObserver

    useEffect(() => {
        // called as soon as DOM is rendered, then every time data or dimensions change
        const svg = select(svgRef.current);
        if (!dimensions) return;
        const {height, width} = dimensions;
        const arcGenerator = arc().innerRadius(75).outerRadius(150);
        const pieGenerator = pie()
            .startAngle(-0.5 * Math.PI)
            .endAngle(0.5 * Math.PI)
            .sort(null);
        const instructions = pieGenerator(data);
        
        svg.selectAll(".slice")
            .data(instructions)
            .join("path")
            .attr("class", "slice")
            .attr("fill", (instruction, i) => (i === 0 ? '#ffcc00' : '#eee'))
            .style('transform', `translate(${width/2}px, ${height}px)`)
            .transition()
            .attrTween("d", function(nextInst) {
                const interpolator =  interpolate(this.lastInst, nextInst);
                this.lastInst = interpolator(1);
                return function(t) {
                    return arcGenerator(interpolator(t));
                }
            });
    }, [data, dimensions]);

    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef}>

            </svg>
        </div>
    );
}

export default GaugeChart;
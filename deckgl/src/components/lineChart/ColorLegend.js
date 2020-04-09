import React from 'react';
export const ColorLegend = ({
    keys,
    colorScale,
    tickSpacing = 20,
    tickSize = 10,
    tickTextOffset = 20,
    onHover,
    hoveredValue,
    fadeOpacity
}) =>
    colorScale.domain().map((domainValue, i) => (
        <g
            className="tick"
            transform={`translate(0,${i * tickSpacing})`}
            // onMouseEnter={() => {
            //     onHover(domainValue);
            // }}
            // onMouseOut={() => {
            //     onHover(null);
            // }}
            // opacity={hoveredValue && domainValue !== hoveredValue ? fadeOpacity : 1}
        >
            <rect fill={colorScale(domainValue)} width="10" height="10" y={-5} />
            <text x={tickTextOffset} dy=".32em">
                {domainValue}
            </text>
        </g>
    ));

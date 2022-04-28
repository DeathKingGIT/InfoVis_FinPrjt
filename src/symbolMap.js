import React from "react";
import { geoPath, geoMercator } from "d3-geo";
import { scaleLinear, min, max } from "d3";

export function SymbolMap(props) {
    const {offsetX, offsetY, map, data, height, width, selectedStation, setSelectedStation} = props;
    const projection = geoMercator().fitSize([width,height], map);
    const path = geoPath(projection);
    const radius = scaleLinear().range([2,20]).domain([min(data,d=>d.start), max(data, d=>d.start)]);
    const getColor = (selectedStation, station)=>{
        return selectedStation&&station===selectedStation?"steelblue":"red";
    }
    const mouseOver = (d) => {
        setSelectedStation(d);
    }
    const mouseOut = () => {
        setSelectedStation(null);
    }
    return <g transform={`translate(${offsetX}, ${offsetY})`}>
            {map.features.map((feature, idx) => {
            return <path key={idx+"boundary"} className={"boundary"} d={path(feature)} />
        })}
        {data.map(d => {
            const [x, y] =  projection([d.longitude, d.latitude]);
            return <circle key={"station" + d.longitude+d.latitude} cx={x} cy={y} r={radius(d.start)} opacity={0.5} 
                fill={getColor(selectedStation, d)} onMouseEnter={()=>{mouseOver(d)}} onMouseOut={mouseOut} />
        })}
        </g>
    
}
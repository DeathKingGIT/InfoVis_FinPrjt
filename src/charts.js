import React from "react";
import { scaleLinear, scaleBand, area, max, curveBasis } from "d3";

function SymmetricBarChart(props) {
    const { offsetX, offsetY, data, height, width, selectedStation, setSelectedStation } = props;
    let xScale = scaleBand().range([0, width]).domain(data.map(d => d.station));
    let yScale = scaleLinear().range([height/2, 0]).domain(0, max(data, d => d.start)).nice();
    let yScale_1 = scaleLinear().range([height/2, 0]).domain(max(data, d => d.end),0).nice();
    
    const getColor = (selectedStation, station)=>{
        return selectedStation&&station===selectedStation?"green":"red";
    }
    const getColor_1 = (selectedStation, station)=>{
        return selectedStation&&station===selectedStation?"orange":"steelblue";
    }
    const mouseOver = (d) => {
        setSelectedStation(d);
    }
    const mouseOut = () => {
        setSelectedStation(null);
    }
    return <g transform={`translate(${offsetX}, ${offsetY})`} >
        {/* the text needed is given as the following */}
        <text style={{ textAnchor:'start', fontSize:'15px'}} transform={`translate(${width/3}, 0)`}>
                {"Num. of ridders start from a station"}
        </text>
        
        <line y2={height/2} stroke={"black"} />
        {yScale.ticks(5).map((tick) => 
            {return <g key={tick+'B'} transform={`translate(0, ${yScale(tick)})`}>
            <line x1={10} x2={width} stroke={"gray"}/>
            <text style={{textAnchor: 'end', fontSize:'6px' }} x={-5} >
            </text>
        </g>}
        )}
        {data.map((d) => {
                return <rect key={d.station} x = {xScale(d.station)} y = {yScale(d.start)} 
                width = {xScale.bandwidth()} height={(height/2)-yScale(d.start)} 
                fill={getColor(selectedStation, d)} stroke={"black"}
                onMouseOver={()=>mouseOver(d)} onMouseOut={mouseOut}/>
            })}
        <line x1={0} y1={height/2} x2={width} y2={height/2} stroke={"black"} />
        {xScale.domain().map( (tickValue, i) => {
            return <g key={tickValue+'B'} transform={`translate(${xScale(tickValue)}, 0)`}>
                <line y2={height} />
                <text style={{textAnchor: 'start', fontSize:'6px' }} y={height+3} transform={`rotate(90, 0, ${height+3})`}>
                </text>
            </g>
        })}

        <g transform={`translate(${0}, ${height/2})`}>
            {/* the text needed is given as the following */}
            <text style={{ textAnchor:'start', fontSize:'15px'}} transform={`translate(${width/3}, ${height/2+10})`}>
            {"Num. of ridders end into a station"}
            </text>
            {<line y2={height/2} stroke='black'/>}
            {yScale.ticks().reverse().map(tickValue => 
                <g key={tickValue} transform={`translate(-10, ${yScale(tickValue)})`}>
                    <line x2={10} stroke='black' />
                    <text style={{ textAnchor:'end', fontSize:'10px' }} >
                        {tickValue}
                    </text>
                </g>
            )}
            {data.map((d) => {
                <rect key={d.station} x = {xScale(d.station)} y = {yScale_1(d.end)} 
                height={height-yScale_1(d.end)} width = {xScale.bandwidth()} 
                fill={getColor_1(selectedStation, d)} stroke={"black"}
                onMouseOver={()=>mouseOver(d)} onMouseOut={mouseOut}/>
            })}
        </g>
   </g>
}

function SymmetricAreaChart(props) {
    const { offsetX, offsetY, data, height, width } = props;
    const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let xScale = scaleBand().range([0, width]).domain(data.map(d => d.month));
    let yScale = scaleLinear().range([height/2, 0]).domain(0, max(data, d => d.start)).nice();
    let yScale_1 = scaleLinear().range([0, height/2]).domain(max(data, d => d.end),0).nice();
    const path_1 = area().x((d) =>{xScale(d.month);}).y0(yScale(0)).y1((d) => {yScale(d.start);}).curve(curveBasis)(data);
    const path_2 = area().x((d) =>{xScale(d.month);}).y0(yScale(0)).y1((d) => {yScale_1(d.end);}).curve(curveBasis)(data);

    return( <g transform={`translate(${offsetX}, ${offsetY})`} >
        {/* the text needed is given as the following */}
        <text style={{ textAnchor:'end', fontSize:'15px'}} transform={`translate(${width}, ${20})rotate(0)`}>
                {"Start"}
        </text>
        <text style={{ textAnchor:'end', fontSize:'15px'}} transform={`translate(${width*2/3}, ${-10})rotate(0)`}>
                {"Num. of riders over the year"}
        </text>
        <g transform={`translate(${offsetX}, ${offsetY+height/2})`}>
            <text style={{ textAnchor:'end', fontSize:'15px'}} transform={`translate(${width}, ${height/2-20})rotate(0)`}>
                {"End"}
        </text>
        </g>
        {data.map((value) => {
          return <path d={path_1} fill={"lightgreen"} stroke={"black"} />;
        })}
        <g>
        {<line y2={height}  stroke="black" />}
        {yScale.ticks(4).map((tickValue) => {
            return <g key={tickValue}  transform={`translate(-10, ${yScale(tickValue)})`}>
            <line  x2={10} stroke="black" />
            <text style={{ textAnchor: "end", fontSize: "10px" }}>
                {tickValue}
            </text>
            </g>
        })}
        </g>
        {data.map((value) => {
          return (
            <g transform={"translate(0," + height + ")"}>
              <path d={path_2} fill={"pink"} stroke={"black"} />
            </g>
          );
        })}
        <g transform={`translate(${offsetX}, ${offsetY + height})`}>
        <g>
        {<line y2={height}  stroke="black" />}
        {yScale.ticks(4).map((tickValue) => {
            return <g key={tickValue}  transform={`translate(-10, ${yScale_1(tickValue)})`}>
            <line  x2={10} stroke="black" />
            <text style={{ textAnchor: "end", fontSize: "10px" }}>
                {tickValue}
            </text>
            </g>
        })}
        </g>
        <g>
        <line x1={0} y1={height} x2={width} y2={height} stroke="black" />
        {xScale && xScale.domain().map((tickValue) => {
            return <g key={tickValue}
            transform={`translate(${xScale(tickValue)}, ${height})`}
            >
            <line y2={10} stroke="black" />
            <text style={{ textAnchor: "middle", fontSize: "10px" }} y={20}>
                {tickValue}
            </text>
            </g>
        })}
        </g>
        <g transform={`translate(${offsetX}, ${offsetY + height / 2})`}>
          <text
            style={{ textAnchor: "end", fontSize: "15px" }}
            transform={`translate(${width}, ${height / 2 - 20})rotate(0)`}
          >
            {"End"}
          </text>
        </g>
      </g>
        
    </g>
    )}

export { SymmetricAreaChart, SymmetricBarChart }


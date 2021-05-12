import React, { useRef, useEffect, useState, createRef } from "react";
import "./AirQuality.css";
import {useD3} from './hooks/useD3';
import  {scaleLinear} from 'd3-scale';


//pm2.5 = 0-251
//pm10 = 0 -421
//voc =  0-9
//no2 = 0-9
function AirQuality() {
    
    const [airquality, setAirQuality] = useState("good");
    const [p25data, setP25Data] = useState([]);
    const [p10data, setP10Data] = useState([]);
    const [vocdata, setVOCData] = useState([]);
    const [no2data, setNO2Data] = useState([]);
    //accept values between 0 and 251 and map to positions 120-370
    const p25scale = scaleLinear().domain([0,251]).range([120,370])
    const p10scale = scaleLinear().domain([0,421]).range([120,370])
    const vocscale = scaleLinear().domain([0,9]).range([120,370])
    const no2scale = scaleLinear().domain([0,9]).range([120,370])

    const randomise = ()=>{
        const d1 = [];
        const m1 = Math.floor(Math.random() * 250);
        
        for (let i = 0 ;i < m1; i++){
            d1.push([Math.random()* 300, Math.random()*300])
        }
        setP25Data(d1);

        const d2 = [];
        const m2 = Math.floor(Math.random() * 400);
        
        for (let i = 0 ;i < m2; i++){
            d2.push([Math.random()* 350, Math.random()*300])
        }
        setP10Data(d2);

        const d3 = [];
        const m3 = Math.floor(Math.random() * 9);
        
        for (let i = 0 ;i < m3; i++){
            d3.push([Math.random()* 310, Math.random()*200])
        }
        setVOCData(d3);

        const d4 = [];
        const m4 = Math.floor(Math.random() * 9);
        
        for (let i = 0 ;i < m4; i++){
            d4.push([Math.random()* 310, Math.random()*200])
        }
        setNO2Data(d4);
    }

    const particulate25 = useD3((root) => {
        root.selectAll("circle#particle").data(p25data, (d,i)=>i).join(
            enter => enter.append("circle")
                            .attr("id", "particle")
                            .attr("cx", d=>90+d[0])
                            .attr("cy", d=>80+d[1])
                            .attr("r",12)
                            
                            .style("fill","#ffba00")
                            .style("stroke","#000")
                            .style("stroke-width",3),
            update=>update,
            exit=>exit.call(exit=>exit.remove())
        ).transition().duration(1500).attr("cx", d=>90+d[0]).attr("cy", d=>80+d[1]).style("opacity",1)

        //circle = 120->370
        root.selectAll("g#total").data([p25data.length], (d,i)=>i).join(
            enter => {
                const total = enter.append("g").attr("id", "total")
                total.append("circle").attr("cx", d=>p25scale(d)).attr("cy", 749).attr("r",43).style("fill","#ffba00").style("stroke","#000").style("stroke-width",3)
                total.append("text").style("text-anchor", "middle").attr("x", d => p25scale(d)).attr("y", 759).attr("class","number").text(d=>d)
            },   
            update=>{
                update.select("circle").transition().duration(1000).attr("cx", d=>p25scale(d))
                update.select("text").text(d=>d).transition().duration(1000).attr("x", d=> p25scale(d))
            },
            exit=>exit.call(exit=>exit.remove())
        )

    },[p25data]);


    const particulate10 = useD3((root) => {
        root.selectAll("g#flower").data(p10data, (d,i)=>i).join(
            enter => {
                const flower = enter.append("g").attr("id", "flower").attr("transform", d=>`translate(${d[0]},${d[1]})`)
                flower.append("path")
                            .attr("id", "particle")
                            .attr("d", "M65.47,109.562c-0,-5.771 2.025,-10.457 4.519,-10.457c2.494,-0 4.519,4.686 4.519,10.457c5.322,-2.885 10.655,-3.581 11.902,-1.553c1.247,2.029 -2.061,6.019 -7.383,8.905c5.322,2.886 8.63,6.876 7.383,8.905c-1.247,2.028 -6.58,1.332 -11.902,-1.553c-0,5.771 -2.025,10.457 -4.519,10.457c-2.494,0 -4.519,-4.686 -4.519,-10.457c-5.322,2.885 -10.656,3.581 -11.903,1.553c-1.247,-2.029 2.062,-6.019 7.384,-8.905c-5.322,-2.886 -8.631,-6.876 -7.384,-8.905c1.247,-2.028 6.581,-1.332 11.903,1.553Z")
                            .style("fill","white")
                            .style("stroke","#000")
                            .style("stroke-width",2)
                
                flower.append("circle")
                            .attr("id", "particle")
                            .attr("cx", 70)
                            .attr("cy", 117)
                            .attr("r", 4)
                            .style("fill","#ffba00")
                            .style("stroke","#000")
                            .style("stroke-width",2)
            
            },
            update=>update,
            exit=>exit.call(exit=>exit.remove())
        ).transition().duration(1000).attr("transform", d=>`translate(${d[0]},${d[1]})`);

        root.selectAll("g#total").data([p10data.length], (d,i)=>i).join(
            enter => {
                const total = enter.append("g").attr("id", "total")
                total.append("circle").attr("cx", d=>p10scale(d)).attr("cy", 749).attr("r",43).style("fill","#ffba00").style("stroke","#000").style("stroke-width",3)
                total.append("text").style("text-anchor", "middle").attr("x", d => p10scale(d)).attr("y", 759).attr("class","number").text(d=>d)
            },   
            update=>{
                update.select("circle").transition().duration(1000).attr("cx", d=>p10scale(d))
                update.select("text").text(d=>d).transition().duration(1000).attr("x", d=> p10scale(d))
            },
            exit=>exit.call(exit=>exit.remove())
        )

    },[p10data]);


    const voc = useD3((root) => {
     root.selectAll("g#aroma").data(vocdata, (d,i)=>i).join(
            enter => {
                const aroma = enter.append("g").attr("id", "aroma").attr("transform", d=>`translate(${d[0]},${d[1]})`)
                aroma.append("path")
                            .attr("d", "M47.668,134.267c-3.24,13.615 -2.171,56.622 5.633,72.867c6.926,14.416 32.485,14.728 41.193,24.602c8.016,9.09 8.534,36.287 11.053,34.641c2.52,-1.647 8.988,-31.791 4.064,-44.521c-4.923,-12.73 -28.091,-17.442 -33.604,-31.86c-6.145,-16.069 1.46,-55.266 -3.263,-64.554c-4.016,-7.898 -23.024,0.204 -25.076,8.825Z")
                            .style("fill","white")
                aroma.append("clipPath").attr("id","_clip1").append("path")
                            .attr("d", "M47.668,134.267c-3.24,13.615 -2.171,56.622 5.633,72.867c6.926,14.416 32.485,14.728 41.193,24.602c8.016,9.09 8.534,36.287 11.053,34.641c2.52,-1.647 8.988,-31.791 4.064,-44.521c-4.923,-12.73 -28.091,-17.442 -33.604,-31.86c-6.145,-16.069 1.46,-55.266 -3.263,-64.554c-4.016,-7.898 -23.024,0.204 -25.076,8.825Z")
                
                aroma.append("g").attr("clip-path","url(#clip1)").append("path")
                            .attr("d", "M47.999,133.277c-0.564,13.074 -2.171,56.622 5.633,72.867c6.926,14.416 32.485,14.728 41.193,24.602c8.016,9.09 9.932,34.899 11.053,34.641c1.121,-0.258 2.834,-26.377 -4.329,-36.189c-7.613,-10.428 -27.782,-17.67 -36.117,-27.987c-11.105,-13.746 -9.342,-58.583 -8.414,-73.51c0.22,-3.528 -8.866,2.045 -9.019,5.576Z").style("fill", "#ffba00")

                aroma.append("path")
                            .attr("d", "M47.668,134.267c-3.24,13.615 -2.171,56.622 5.633,72.867c6.926,14.416 32.485,14.728 41.193,24.602c8.016,9.09 8.534,36.287 11.053,34.641c2.52,-1.647 8.988,-31.791 4.064,-44.521c-4.923,-12.73 -28.091,-17.442 -33.604,-31.86c-6.145,-16.069 1.46,-55.266 -3.263,-64.554c-4.016,-7.898 -23.024,0.204 -25.076,8.825Z")
                            .style("fill","none")
                            .style("stroke","#000")
                            .style("stroke-width",3)
            },
            update=>update,
            exit=>exit.call(exit=>exit.remove())
        ).transition().duration(1000).attr("transform", d=>`translate(${d[0]},${d[1]})`);

        root.selectAll("g#total").data([vocdata.length], (d,i)=>i).join(
            enter => {
                const total = enter.append("g").attr("id", "total")
                total.append("circle").attr("cx", d=>vocscale(d)).attr("cy", 749).attr("r",43).style("fill","#ffba00").style("stroke","#000").style("stroke-width",3)
                total.append("text").style("text-anchor", "middle").attr("x", d => vocscale(d)).attr("y", 759).attr("class","number").text(d=>d)
            },   
            update=>{
                update.select("circle").transition().duration(1000).attr("cx", d=>vocscale(d))
                update.select("text").text(d=>d).transition().duration(1000).attr("x", d=> vocscale(d))
            },
            exit=>exit.call(exit=>exit.remove())
        )
    }, [vocdata]);

    const no2 = useD3((root) => {

        root.selectAll("g#no2").data(no2data, (d,i)=>i).join(
               enter => {
               enter.append("g")
                    .attr("id", "no2")
                    .attr("transform", d=>`translate(${d[0]},${d[1]})`)
                    .append("path")
                    .attr("d", "M71.989,118.101c0.667,-2.367 2.823,-4.001 5.278,-4.001c2.455,-0 4.611,1.634 5.278,4.001l3.165,11.242l9.639,-6.574c2.029,-1.384 4.73,-1.248 6.611,0.333c1.881,1.581 2.483,4.221 1.475,6.463l-4.79,10.65l11.603,1.17c2.443,0.246 4.425,2.089 4.851,4.511c0.426,2.422 -0.807,4.832 -3.018,5.901l-10.504,5.074l8.138,8.367c1.713,1.761 2.049,4.449 0.821,6.579c-1.228,2.129 -3.719,3.182 -6.099,2.577l-11.303,-2.876l0.865,11.649c0.182,2.452 -1.286,4.727 -3.593,5.568c-2.307,0.841 -4.892,0.044 -6.326,-1.952l-6.813,-9.48l-6.813,9.48c-1.435,1.996 -4.019,2.793 -6.326,1.952c-2.307,-0.841 -3.775,-3.116 -3.593,-5.568l0.864,-11.649l-11.302,2.876c-2.38,0.605 -4.871,-0.448 -6.099,-2.577c-1.228,-2.13 -0.892,-4.818 0.821,-6.579l8.137,-8.367l-10.503,-5.074c-2.212,-1.069 -3.445,-3.479 -3.018,-5.901c0.426,-2.422 2.408,-4.265 4.851,-4.511l11.603,-1.17l-4.79,-10.65c-1.009,-2.242 -0.406,-4.882 1.475,-6.463c1.881,-1.581 4.581,-1.717 6.611,-0.333l9.639,6.574l3.165,-11.242Z")
                    .style("fill","#ffba00")
                    .style("stroke", "#000")
                    .style("stroke-width", 3)
               },
               update=>update,
               exit=>exit.call(exit=>exit.remove())
           ).transition().duration(1000).attr("transform", d=>`translate(${d[0]},${d[1]})`);
   
           root.selectAll("g#total").data([no2data.length], (d,i)=>i).join(
               enter => {
                   const total = enter.append("g").attr("id", "total")
                   total.append("circle").attr("cx", d=>no2scale(d)).attr("cy", 749).attr("r",43).style("fill","#ffba00").style("stroke","#000").style("stroke-width",3)
                   total.append("text").style("text-anchor", "middle").attr("x", d => no2scale(d)).attr("y", 759).attr("class","number").text(d=>d)
               },   
               update=>{
                   update.select("circle").transition().duration(1000).attr("cx", d=>no2scale(d))
                   update.select("text").text(d=>d).transition().duration(1000).attr("x", d=> no2scale(d))
               },
               exit=>exit.call(exit=>exit.remove())
           )
       }, [no2data]);

    const renderParticulate25 = ()=>{
       return ( <svg  width="100%" height="100%" viewBox="0 0 503 797" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:1.5}}>
        <circle cx="251.5" cy="254.658" r="250" ry="253.158" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
        <path d="M403.664,746.307c0,-6.085 -4.939,-11.025 -11.024,-11.025l-279.968,0c-6.085,0 -11.025,4.94 -11.025,11.025c0,6.084 4.94,11.024 11.025,11.024l279.968,0c6.085,0 11.024,-4.94 11.024,-11.024Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
        <g ref={particulate25}></g>        
        <g>
            <path d="M23.252,734.104c0.537,6.045 0.755,26.796 -0.079,32.472c-0.102,0.692 0.696,1.578 1.396,1.569c7.249,-0.092 36.369,3.621 43.935,0.419c3.302,-1.398 2.725,-6.834 3.254,-7.864c0.39,-0.76 4.111,-3.068 4.368,-5.667c0.225,-2.275 -0.255,-3.63 -1.841,-5.342c-0.649,-0.701 3.649,-2.838 3.721,-5.337c0.061,-2.117 -2.397,-4.757 -2.211,-6.518c0.237,-2.231 2.585,-4.994 1.33,-7.579c-0.879,-1.808 -2.454,-4.303 -5.461,-5.156c-3.793,-1.077 -14.412,0.133 -17.583,-0.197c-0.761,-0.079 -1.631,-1.042 -1.444,-1.784c0.722,-2.872 4.912,-11.136 5.777,-15.447c0.822,-4.098 -1.396,-9.652 -3.688,-10.853c-1.809,-0.948 -4.814,-0.313 -5.973,1.369c-1.746,2.534 -0.167,11.25 -4.504,13.839c-7.252,4.33 -15.261,13.284 -15.672,18.282c-0.175,2.123 -5.513,1.672 -5.325,3.794Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <path d="M479.748,757.705c-0.537,-6.045 -0.755,-26.797 0.079,-32.472c0.102,-0.693 -0.696,-1.578 -1.396,-1.569c-7.249,0.092 -36.369,-3.621 -43.935,-0.419c-3.302,1.397 -2.725,6.834 -3.254,7.863c-0.39,0.76 -4.111,3.068 -4.368,5.667c-0.225,2.275 0.255,3.631 1.841,5.342c0.649,0.702 -3.649,2.838 -3.721,5.338c-0.061,2.117 2.397,4.757 2.211,6.518c-0.237,2.231 -2.585,4.994 -1.33,7.579c0.879,1.807 2.454,4.303 5.461,5.156c3.793,1.076 14.412,-0.133 17.583,0.197c0.761,0.079 1.631,1.042 1.444,1.784c-0.722,2.871 -4.912,11.136 -5.777,15.447c-0.822,4.097 1.396,9.651 3.688,10.853c1.809,0.948 4.814,0.313 5.973,-1.369c1.746,-2.535 0.167,-11.25 4.504,-13.839c7.252,-4.33 15.261,-13.285 15.672,-18.283c0.175,-2.123 5.513,-1.671 5.325,-3.793Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="227.895" cy="490.3" r="46.458" ry="46.51" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <path d="M252.818,537.302c-7.667,4.118 -16.456,6.458 -25.796,6.458c-29.812,0 -54.015,-23.843 -54.015,-53.211c-0,-29.367 24.203,-53.21 54.015,-53.21c29.811,-0 54.015,23.843 54.015,53.21c-0,12.294 -4.241,23.619 -11.36,32.633c0.357,0.267 0.686,0.582 0.98,0.944l58.092,71.499c1.935,2.382 1.573,5.888 -0.81,7.824l-8.634,7.015c-2.382,1.936 -5.888,1.573 -7.824,-0.81l-58.091,-71.499c-0.221,-0.271 -0.411,-0.557 -0.572,-0.853Zm-25.277,-92.902c25.726,-0 46.612,20.693 46.612,46.181c0,25.488 -20.886,46.181 -46.612,46.181c-25.725,-0 -46.611,-20.693 -46.611,-46.181c-0,-25.488 20.886,-46.181 46.611,-46.181Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="276.748" cy="453.165" r="2.993"  style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="261.998" cy="429.403" r="3.419"  style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="266.324" cy="442.669" r="4.216"  style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="252.359" cy="436.797" r="2.993"  style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="273.967" cy="432.826" r="2.993" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="242.99" cy="495.464" r="5.525"  style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="254.477" cy="515.942" r="6.814"  style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="232.664" cy="510.081" r="4.838"  style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="260.542" cy="495.084" r="4.838"  style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="235.4" cy="452.43" r="5.525"  style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="246.886" cy="472.908" r="6.814"  style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="281.807" cy="442.406" r="3.682"  style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="227.466" cy="467.785" r="4.838"  style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
        </g>
     </svg>);
    }

    const renderParticulate10 = ()=>{
        return ( <svg  width="100%" height="100%" viewBox="0 0 503 797" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:1.5}}>
         <circle cx="251.5" cy="254.658" r="250" ry="253.158" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
         <path d="M403.664,746.307c0,-6.085 -4.939,-11.025 -11.024,-11.025l-279.968,0c-6.085,0 -11.025,4.94 -11.025,11.025c0,6.084 4.94,11.024 11.025,11.024l279.968,0c6.085,0 11.024,-4.94 11.024,-11.024Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
         <g ref={particulate10}></g>   
         <path d="M23.252,734.104c0.537,6.045 0.755,26.796 -0.079,32.472c-0.102,0.692 0.696,1.578 1.396,1.569c7.249,-0.092 36.369,3.621 43.935,0.419c3.302,-1.398 2.725,-6.834 3.254,-7.864c0.39,-0.76 4.111,-3.068 4.368,-5.667c0.225,-2.275 -0.255,-3.63 -1.841,-5.342c-0.649,-0.701 3.649,-2.838 3.721,-5.337c0.061,-2.117 -2.397,-4.757 -2.211,-6.518c0.237,-2.231 2.585,-4.994 1.33,-7.579c-0.879,-1.808 -2.454,-4.303 -5.461,-5.156c-3.793,-1.077 -14.412,0.133 -17.583,-0.197c-0.761,-0.079 -1.631,-1.042 -1.444,-1.784c0.722,-2.872 4.912,-11.136 5.777,-15.447c0.822,-4.098 -1.396,-9.652 -3.688,-10.853c-1.809,-0.948 -4.814,-0.313 -5.973,1.369c-1.746,2.534 -0.167,11.25 -4.504,13.839c-7.252,4.33 -15.261,13.284 -15.672,18.282c-0.175,2.123 -5.513,1.672 -5.325,3.794Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <path d="M479.748,757.705c-0.537,-6.045 -0.755,-26.797 0.079,-32.472c0.102,-0.693 -0.696,-1.578 -1.396,-1.569c-7.249,0.092 -36.369,-3.621 -43.935,-0.419c-3.302,1.397 -2.725,6.834 -3.254,7.863c-0.39,0.76 -4.111,3.068 -4.368,5.667c-0.225,2.275 0.255,3.631 1.841,5.342c0.649,0.702 -3.649,2.838 -3.721,5.338c-0.061,2.117 2.397,4.757 2.211,6.518c-0.237,2.231 -2.585,4.994 -1.33,7.579c0.879,1.807 2.454,4.303 5.461,5.156c3.793,1.076 14.412,-0.133 17.583,0.197c0.761,0.079 1.631,1.042 1.444,1.784c-0.722,2.871 -4.912,11.136 -5.777,15.447c-0.822,4.097 1.396,9.651 3.688,10.853c1.809,0.948 4.814,0.313 5.973,-1.369c1.746,-2.535 0.167,-11.25 4.504,-13.839c7.252,-4.33 15.261,-13.285 15.672,-18.283c0.175,-2.123 5.513,-1.671 5.325,-3.793Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
                     
        <g>
            <path d="M235.343,472.72c0,-23.895 8.383,-43.294 18.709,-43.294c10.325,-0 18.708,19.399 18.708,43.294c22.033,-11.947 44.112,-14.828 49.275,-6.43c5.162,8.399 -8.534,24.917 -30.566,36.865c22.032,11.947 35.728,28.465 30.566,36.864c-5.163,8.399 -27.242,5.518 -49.275,-6.43c0,23.895 -8.383,43.294 -18.708,43.294c-10.326,0 -18.709,-19.399 -18.709,-43.294c-22.032,11.948 -44.112,14.829 -49.274,6.43c-5.163,-8.399 8.533,-24.917 30.566,-36.864c-22.033,-11.948 -35.729,-28.466 -30.566,-36.865c5.162,-8.398 27.242,-5.517 49.274,6.43Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="254.361" cy="503.114" r="20" style={{fill:"#ffba00",stroke:"#000",strokeWidth:3}}/>
        </g>
     
      </svg>);
     }

     const renderVOC = ()=>{
        return ( <svg  width="100%" height="100%" viewBox="0 0 503 797" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:1.5}}>
         <circle cx="251.5" cy="254.658" r="250" ry="253.158" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
         <path d="M403.664,746.307c0,-6.085 -4.939,-11.025 -11.024,-11.025l-279.968,0c-6.085,0 -11.025,4.94 -11.025,11.025c0,6.084 4.94,11.024 11.025,11.024l279.968,0c6.085,0 11.024,-4.94 11.024,-11.024Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
         <g ref={voc}></g>   
            <path d="M23.252,734.104c0.537,6.045 0.755,26.796 -0.079,32.472c-0.102,0.692 0.696,1.578 1.396,1.569c7.249,-0.092 36.369,3.621 43.935,0.419c3.302,-1.398 2.725,-6.834 3.254,-7.864c0.39,-0.76 4.111,-3.068 4.368,-5.667c0.225,-2.275 -0.255,-3.63 -1.841,-5.342c-0.649,-0.701 3.649,-2.838 3.721,-5.337c0.061,-2.117 -2.397,-4.757 -2.211,-6.518c0.237,-2.231 2.585,-4.994 1.33,-7.579c-0.879,-1.808 -2.454,-4.303 -5.461,-5.156c-3.793,-1.077 -14.412,0.133 -17.583,-0.197c-0.761,-0.079 -1.631,-1.042 -1.444,-1.784c0.722,-2.872 4.912,-11.136 5.777,-15.447c0.822,-4.098 -1.396,-9.652 -3.688,-10.853c-1.809,-0.948 -4.814,-0.313 -5.973,1.369c-1.746,2.534 -0.167,11.25 -4.504,13.839c-7.252,4.33 -15.261,13.284 -15.672,18.282c-0.175,2.123 -5.513,1.672 -5.325,3.794Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <path d="M479.748,757.705c-0.537,-6.045 -0.755,-26.797 0.079,-32.472c0.102,-0.693 -0.696,-1.578 -1.396,-1.569c-7.249,0.092 -36.369,-3.621 -43.935,-0.419c-3.302,1.397 -2.725,6.834 -3.254,7.863c-0.39,0.76 -4.111,3.068 -4.368,5.667c-0.225,2.275 0.255,3.631 1.841,5.342c0.649,0.702 -3.649,2.838 -3.721,5.338c-0.061,2.117 2.397,4.757 2.211,6.518c-0.237,2.231 -2.585,4.994 -1.33,7.579c0.879,1.807 2.454,4.303 5.461,5.156c3.793,1.076 14.412,-0.133 17.583,0.197c0.761,0.079 1.631,1.042 1.444,1.784c-0.722,2.871 -4.912,11.136 -5.777,15.447c-0.822,4.097 1.396,9.651 3.688,10.853c1.809,0.948 4.814,0.313 5.973,-1.369c1.746,-2.535 0.167,-11.25 4.504,-13.839c7.252,-4.33 15.261,-13.285 15.672,-18.283c0.175,-2.123 5.513,-1.671 5.325,-3.793Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
                     
        <g>
            <g>
                <path d="M232.558,449.836l-54.296,98.412c0,18.105 16.992,32.804 37.922,32.804l82.056,-0c20.93,-0 37.922,-14.699 37.922,-32.804l-55.069,-98.412l-0,-15.029c-0,-5.793 -5.437,-10.496 -12.134,-10.496l-24.267,-0c-6.697,-0 -12.134,4.703 -12.134,10.496l0,15.029Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
                <path d="M336.162,548.248c-15.464,-2.65 -33.579,2.812 -49.518,1.587c-35.38,-2.719 -69.644,-8.947 -108.382,-1.587c0,18.105 16.992,32.804 37.922,32.804l82.056,-0c20.93,-0 37.922,-14.699 37.922,-32.804Z" style={{fill:"#ffba00",stroke:"#000",strokeWidth:3}}/>
            </g>
        </g>
      </svg>);
     }

     const renderNO2 = ()=>{
        return ( <svg  width="100%" height="100%" viewBox="0 0 503 797" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:1.5}}>
         <circle cx="251.5" cy="254.658" r="250" ry="253.158" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
         <path d="M403.664,746.307c0,-6.085 -4.939,-11.025 -11.024,-11.025l-279.968,0c-6.085,0 -11.025,4.94 -11.025,11.025c0,6.084 4.94,11.024 11.025,11.024l279.968,0c6.085,0 11.024,-4.94 11.024,-11.024Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
         <g ref={no2}></g>   
         <path d="M23.252,734.104c0.537,6.045 0.755,26.796 -0.079,32.472c-0.102,0.692 0.696,1.578 1.396,1.569c7.249,-0.092 36.369,3.621 43.935,0.419c3.302,-1.398 2.725,-6.834 3.254,-7.864c0.39,-0.76 4.111,-3.068 4.368,-5.667c0.225,-2.275 -0.255,-3.63 -1.841,-5.342c-0.649,-0.701 3.649,-2.838 3.721,-5.337c0.061,-2.117 -2.397,-4.757 -2.211,-6.518c0.237,-2.231 2.585,-4.994 1.33,-7.579c-0.879,-1.808 -2.454,-4.303 -5.461,-5.156c-3.793,-1.077 -14.412,0.133 -17.583,-0.197c-0.761,-0.079 -1.631,-1.042 -1.444,-1.784c0.722,-2.872 4.912,-11.136 5.777,-15.447c0.822,-4.098 -1.396,-9.652 -3.688,-10.853c-1.809,-0.948 -4.814,-0.313 -5.973,1.369c-1.746,2.534 -0.167,11.25 -4.504,13.839c-7.252,4.33 -15.261,13.284 -15.672,18.282c-0.175,2.123 -5.513,1.672 -5.325,3.794Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
        <path d="M479.748,757.705c-0.537,-6.045 -0.755,-26.797 0.079,-32.472c0.102,-0.693 -0.696,-1.578 -1.396,-1.569c-7.249,0.092 -36.369,-3.621 -43.935,-0.419c-3.302,1.397 -2.725,6.834 -3.254,7.863c-0.39,0.76 -4.111,3.068 -4.368,5.667c-0.225,2.275 0.255,3.631 1.841,5.342c0.649,0.702 -3.649,2.838 -3.721,5.338c-0.061,2.117 2.397,4.757 2.211,6.518c-0.237,2.231 -2.585,4.994 -1.33,7.579c0.879,1.807 2.454,4.303 5.461,5.156c3.793,1.076 14.412,-0.133 17.583,0.197c0.761,0.079 1.631,1.042 1.444,1.784c-0.722,2.871 -4.912,11.136 -5.777,15.447c-0.822,4.097 1.396,9.651 3.688,10.853c1.809,0.948 4.814,0.313 5.973,-1.369c1.746,-2.535 0.167,-11.25 4.504,-13.839c7.252,-4.33 15.261,-13.285 15.672,-18.283c0.175,-2.123 5.513,-1.671 5.325,-3.793Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
                     
        <g>
        <circle cx="240.833" cy="557.678" r="27.448"  style={{fill:"#ffba00",stroke:"#000",strokeWidth:3}}/>
        <path d="M369.883,503.524l0,18.42c0,14.355 -11.654,26.009 -26.009,26.009l-72.54,0c-2.993,-13.829 -15.764,-24.232 -31.045,-24.232c-15.282,-0 -28.053,10.403 -31.046,24.232l-16.798,0c-7.833,0 -14.193,-6.359 -14.193,-14.193l0,-28.386c0,-7.833 6.36,-14.193 14.193,-14.193l36.215,0l-0,-21.255c-0,-14.354 11.654,-26.009 26.009,-26.009l89.205,0c10.198,0 19.033,5.882 23.295,14.436l-38.377,0c-6.233,0 -11.293,5.06 -11.293,11.293l0,22.585c0,6.233 5.06,11.293 11.293,11.293l41.091,-0Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}} />
        </g>
     
      </svg>);
     }

    return ( <>
        <button style={{border:"none", background:"none"}} onClick={()=>randomise()}>new reading</button>
        <div>
        <div style={{display:"flex",  flexDirection:"row", alignItems:"center", justifyContent:"center", height:"calc(100vh - 200px)"}}>
                <div style={{display:"flex", flex: "1 1 0", flexDirection:"column", margin:20}}>
                    <div className="heading">Particulate matter (<strong>2.5</strong>)</div>
                    {renderParticulate25()}
                    <div className="smalltext" style={{"height":120}}>Particles smaller than 2.5 microns.  Includes <strong>smoke, industrial emissions</strong> and <strong>burning candles</strong></div>
                </div>
                <div style={{display:"flex", flex: "1 1 0", flexDirection:"column", margin:20}}>
                    <div className="heading">Particulate matter (<strong>10</strong>)</div>
                    {renderParticulate10()}
                    <div className="smalltext" style={{"height":120}}>Particles smaller than 10 microns.  Includes <strong>pollen</strong> and <strong>other allergens</strong></div>
                </div>
                <div style={{display:"flex", flex: "1 1 0", flexDirection:"column", margin:20}}>
                    <div className="heading">Volatile organic compounds</div>
                    {renderVOC()}
                    <div className="smalltext" style={{"height":120}}><strong>Odours</strong> that may be harmful. Includes <strong>cooking </strong> burning <strong>fuel, perfume </strong>and <strong>cleaning products</strong></div>
                </div>
                <div style={{display:"flex", flex: "1 1 0", flexDirection:"column", margin:20}}>
                    <div className="heading">Nitrogen Dioxide</div>
                    {renderNO2()}
                    <div className="smalltext" style={{"height":120}}>Gases released by <strong>combustion</strong>. Includes <strong>cooking gas </strong> and <strong>vehicle emissions </strong></div>
                </div>
        </div>
            <div style={{paddingTop:0, textAlign:"center"}} className="largeheading">overall air quality: {airquality}</div>
        </div>
    </>)
  
}

export default AirQuality;


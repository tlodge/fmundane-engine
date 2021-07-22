import React, { useRef, useEffect, useState, createRef } from "react";
import "./AirQuality.css";
import {useD3} from './hooks/useD3';
import  {scaleLinear} from 'd3-scale';


//pm2.5 = 0-251
//pm10 = 0 -421
//voc =  0-9
//no2 = 0-9

const randomise = (max, xmax, ymax)=>{
    const d1 = [];
    for (let i = 0 ;i < max; i++){
        d1.push([Math.random()* xmax, Math.random()*ymax])
    }
    return d1;
}

const MINXPOS = 80;
const MAXXPOS = 370;

function AirQuality({data={}}) {
    
    let {pm25, pm10,voc, no2, time} = data;

    const [airquality, setAirQuality] = useState("good");
    const [toggle, setToggle] = useState(false);

    

    //accept values between 0 and 251 and map to positions 120-370
    const p25scale = scaleLinear().domain([0,251]).range([MINXPOS,MAXXPOS])
    const p25rscale = scaleLinear().domain([0,251]).range([0,-180])

    const p10scale = scaleLinear().domain([0,421]).range([MINXPOS,MAXXPOS])
    const p10rscale = scaleLinear().domain([0,421]).range([0,-180])

    const vocscale = scaleLinear().domain([0,9]).range([MINXPOS,MAXXPOS])
    const vocrscale = scaleLinear().domain([0,9]).range([0,-180])

    const no2scale = scaleLinear().domain([0,9]).range([MINXPOS,MAXXPOS])
    const no2rscale = scaleLinear().domain([0,9]).range([0,-180])
    
    useEffect(()=>{
        const severe            = pm25 >= 251 || pm10 >=  421;
        const extremelypoor    = pm25 >= 151 || pm10 >=420;
        const verypoor          = pm25 >= 71  || pm10 >=101 || voc >=9 || no2 >=9;
        const poor              = pm25 >=54   || pm10 >=76  || voc >=7 || no2 >=7;
        const fair              = pm25 >=36   || pm10 >=51  || voc >= 4|| no2 >=4;
       
        setAirQuality(severe ? "severe" : extremelypoor ? "extremely poor" : verypoor ? "very poor" : poor ? "poor" : fair ? "fair" : "good");

    },[pm25,pm10,voc,no2])

    const particulate25 = useD3((root) => {
        
        const p25data = randomise(pm25, 300, 300);
      
        
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
                
                //total.append("circle").attr("cx", d=>p25scale(d)).attr("cy", 749).attr("r",43).style("fill","#ffba00").style("stroke","#000").style("stroke-width",3)
                total.append("path")
                     .attr("d", "M16.688,734.341c0.736,8.285 1.035,36.727 -0.109,44.506c-0.14,0.949 0.954,2.163 1.914,2.151c9.935,-0.126 49.847,4.963 60.218,0.574c4.525,-1.915 3.734,-9.366 4.459,-10.777c0.535,-1.042 5.635,-4.206 5.987,-7.768c0.308,-3.118 -0.349,-4.976 -2.523,-7.322c-0.89,-0.961 5.001,-3.889 5.1,-7.315c0.083,-2.902 -3.286,-6.52 -3.03,-8.934c0.324,-3.057 3.543,-6.845 1.822,-10.387c-1.204,-2.478 -3.364,-5.898 -7.485,-7.067c-5.199,-1.476 -19.753,0.182 -24.1,-0.27c-1.043,-0.109 -2.234,-1.428 -1.979,-2.445c0.99,-3.936 6.733,-15.263 7.918,-21.172c1.127,-5.616 -1.912,-13.228 -5.054,-14.875c-2.48,-1.3 -6.598,-0.43 -8.186,1.876c-2.394,3.474 -0.23,15.419 -6.174,18.968c-9.94,5.935 -20.917,18.207 -21.48,25.058c-0.24,2.91 -7.556,2.291 -7.298,5.199Z")
                     .style("fill","#ffba00")
                     .style("stroke","#000")
                     .style("stroke-width",3)
                     .attr("transform", d=>`rotate(${p25rscale(d)},51,745)`)

                total.append("text").attr("x", d => p25scale(d)-28).attr("y", 755).attr("class","number").style("text-anchor", "middle").text(d=>d)
            },   
            update=>{
                update.transition().duration(1000).attr("transform", d=>`translate(${p25scale(d)},0)`).on("end", ()=>{
                    update.select("path").attr("transform", d=>`rotate(${p25rscale(d)},51,745)`)
                })
                
                update.select("text").text(d=>d)
            },
            exit=>exit.call(exit=>exit.remove())
        )

    },[pm25,time,toggle]);
    
 
    const particulate10 = useD3((root) => {
        const p10data = randomise(pm10, 350, 300)
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
                total.append("path")
                .attr("d", "M16.688,734.341c0.736,8.285 1.035,36.727 -0.109,44.506c-0.14,0.949 0.954,2.163 1.914,2.151c9.935,-0.126 49.847,4.963 60.218,0.574c4.525,-1.915 3.734,-9.366 4.459,-10.777c0.535,-1.042 5.635,-4.206 5.987,-7.768c0.308,-3.118 -0.349,-4.976 -2.523,-7.322c-0.89,-0.961 5.001,-3.889 5.1,-7.315c0.083,-2.902 -3.286,-6.52 -3.03,-8.934c0.324,-3.057 3.543,-6.845 1.822,-10.387c-1.204,-2.478 -3.364,-5.898 -7.485,-7.067c-5.199,-1.476 -19.753,0.182 -24.1,-0.27c-1.043,-0.109 -2.234,-1.428 -1.979,-2.445c0.99,-3.936 6.733,-15.263 7.918,-21.172c1.127,-5.616 -1.912,-13.228 -5.054,-14.875c-2.48,-1.3 -6.598,-0.43 -8.186,1.876c-2.394,3.474 -0.23,15.419 -6.174,18.968c-9.94,5.935 -20.917,18.207 -21.48,25.058c-0.24,2.91 -7.556,2.291 -7.298,5.199Z")
                     .style("fill","#ffba00")
                     .style("stroke","#000")
                     .style("stroke-width",3)
                     .attr("transform", d=>`rotate(${p10rscale(d)},51,745)`)
            
                total.append("text").style("text-anchor", "middle").attr("x", d => p10scale(d)-28).attr("y", 755).attr("class","number").text(d=>d)
            },   
            update=>{
                update.transition().duration(1000).attr("transform", d=>`translate(${p10scale(d)},0)`).on("end", ()=>{
                    update.select("path").attr("transform", d=>`rotate(${p10rscale(d)},51,745)`)
                })
              
                update.select("text").text(d=>d)
            },
            exit=>exit.call(exit=>exit.remove())
        )

    },[pm10, time]);


    const vocref = useD3((root) => {
     const vocdata = randomise(voc, 310, 200);

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
                total.append("path")
                .attr("d", "M16.688,734.341c0.736,8.285 1.035,36.727 -0.109,44.506c-0.14,0.949 0.954,2.163 1.914,2.151c9.935,-0.126 49.847,4.963 60.218,0.574c4.525,-1.915 3.734,-9.366 4.459,-10.777c0.535,-1.042 5.635,-4.206 5.987,-7.768c0.308,-3.118 -0.349,-4.976 -2.523,-7.322c-0.89,-0.961 5.001,-3.889 5.1,-7.315c0.083,-2.902 -3.286,-6.52 -3.03,-8.934c0.324,-3.057 3.543,-6.845 1.822,-10.387c-1.204,-2.478 -3.364,-5.898 -7.485,-7.067c-5.199,-1.476 -19.753,0.182 -24.1,-0.27c-1.043,-0.109 -2.234,-1.428 -1.979,-2.445c0.99,-3.936 6.733,-15.263 7.918,-21.172c1.127,-5.616 -1.912,-13.228 -5.054,-14.875c-2.48,-1.3 -6.598,-0.43 -8.186,1.876c-2.394,3.474 -0.23,15.419 -6.174,18.968c-9.94,5.935 -20.917,18.207 -21.48,25.058c-0.24,2.91 -7.556,2.291 -7.298,5.199Z")
                   .style("fill","#ffba00")
                   .style("stroke","#000")
                   .style("stroke-width",3)
                   .attr("transform", d=>`rotate(${vocrscale(d)},51,745)`)
          
                   total.append("text").style("text-anchor", "middle").attr("x", d => vocscale(d)-28).attr("y", 755).attr("class","number").text(d=>d)
            },   
            update=>{
                update.transition().duration(1000).attr("transform", d=>`translate(${vocscale(d)},0)`).on("end", ()=>{
                    update.select("path").attr("transform", d=>`rotate(${vocrscale(d)},51,745)`)
                })
              
                update.select("text").text(d=>d)
            },
            exit=>exit.call(exit=>exit.remove())
        )
    }, [voc, time]);

    const no2ref = useD3((root) => {
        const no2data = randomise(no2, 310, 300);
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
                   total.append("path")
                   .attr("d", "M16.688,734.341c0.736,8.285 1.035,36.727 -0.109,44.506c-0.14,0.949 0.954,2.163 1.914,2.151c9.935,-0.126 49.847,4.963 60.218,0.574c4.525,-1.915 3.734,-9.366 4.459,-10.777c0.535,-1.042 5.635,-4.206 5.987,-7.768c0.308,-3.118 -0.349,-4.976 -2.523,-7.322c-0.89,-0.961 5.001,-3.889 5.1,-7.315c0.083,-2.902 -3.286,-6.52 -3.03,-8.934c0.324,-3.057 3.543,-6.845 1.822,-10.387c-1.204,-2.478 -3.364,-5.898 -7.485,-7.067c-5.199,-1.476 -19.753,0.182 -24.1,-0.27c-1.043,-0.109 -2.234,-1.428 -1.979,-2.445c0.99,-3.936 6.733,-15.263 7.918,-21.172c1.127,-5.616 -1.912,-13.228 -5.054,-14.875c-2.48,-1.3 -6.598,-0.43 -8.186,1.876c-2.394,3.474 -0.23,15.419 -6.174,18.968c-9.94,5.935 -20.917,18.207 -21.48,25.058c-0.24,2.91 -7.556,2.291 -7.298,5.199Z")
                   .style("fill","#ffba00")
                   .style("stroke","#000")
                   .style("stroke-width",3)
                   .attr("transform", d=>`rotate(${no2rscale(d)},51,745)`)
          
                   total.append("text").style("text-anchor", "middle").attr("x", d => no2scale(d)-28).attr("y", 755).attr("class","number").text(d=>d)

        
               },   
               update=>{
                    update.transition().duration(1000).attr("transform", d=>`translate(${no2scale(d)},0)`).on("end", ()=>{
                    update.select("path").attr("transform", d=>`rotate(${no2rscale(d)},51,745)`)
                })
              
                update.select("text").text(d=>d)
               },
               exit=>exit.call(exit=>exit.remove())
           )
       }, [no2, time]);
      // cx="51.653" cy="735.815"
    const renderParticulate25 = ()=>{
       return ( <svg  width="100%" height="100%" viewBox="0 0 503 810" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:1.5}}>
        <circle cx="251.5" cy="254.658" r="250" ry="253.158" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
        <path d="M403.664,746.307c0,-6.085 -4.939,-11.025 -11.024,-11.025l-279.968,0c-6.085,0 -11.025,4.94 -11.025,11.025c0,6.084 4.94,11.024 11.025,11.024l279.968,0c6.085,0 11.024,-4.94 11.024,-11.024Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
        <g ref={particulate25}></g>        
        <g>
          
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
        return ( <svg  width="100%" height="100%" viewBox="0 0 503 810" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:1.5}}>
         <circle cx="251.5" cy="254.658" r="250" ry="253.158" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
         <path d="M403.664,746.307c0,-6.085 -4.939,-11.025 -11.024,-11.025l-279.968,0c-6.085,0 -11.025,4.94 -11.025,11.025c0,6.084 4.94,11.024 11.025,11.024l279.968,0c6.085,0 11.024,-4.94 11.024,-11.024Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
         <g ref={particulate10}></g>   
         
                     
        <g>
            <path d="M235.343,472.72c0,-23.895 8.383,-43.294 18.709,-43.294c10.325,-0 18.708,19.399 18.708,43.294c22.033,-11.947 44.112,-14.828 49.275,-6.43c5.162,8.399 -8.534,24.917 -30.566,36.865c22.032,11.947 35.728,28.465 30.566,36.864c-5.163,8.399 -27.242,5.518 -49.275,-6.43c0,23.895 -8.383,43.294 -18.708,43.294c-10.326,0 -18.709,-19.399 -18.709,-43.294c-22.032,11.948 -44.112,14.829 -49.274,6.43c-5.163,-8.399 8.533,-24.917 30.566,-36.864c-22.033,-11.948 -35.729,-28.466 -30.566,-36.865c5.162,-8.398 27.242,-5.517 49.274,6.43Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <circle cx="254.361" cy="503.114" r="20" style={{fill:"#ffba00",stroke:"#000",strokeWidth:3}}/>
        </g>
     
      </svg>);
     }

     const renderVOC = ()=>{
        return ( <svg  width="100%" height="100%" viewBox="0 0 503 810" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:1.5}}>
         <circle cx="251.5" cy="254.658" r="250" ry="253.158" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
         <path d="M403.664,746.307c0,-6.085 -4.939,-11.025 -11.024,-11.025l-279.968,0c-6.085,0 -11.025,4.94 -11.025,11.025c0,6.084 4.94,11.024 11.025,11.024l279.968,0c6.085,0 11.024,-4.94 11.024,-11.024Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
         <g ref={vocref}></g>    
        <g>
            <path d="M232.558,449.836l-54.296,98.412c0,18.105 16.992,32.804 37.922,32.804l82.056,-0c20.93,-0 37.922,-14.699 37.922,-32.804l-55.069,-98.412l-0,-15.029c-0,-5.793 -5.437,-10.496 -12.134,-10.496l-24.267,-0c-6.697,-0 -12.134,4.703 -12.134,10.496l0,15.029Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
            <path d="M336.162,548.248c-15.464,-2.65 -33.579,2.812 -49.518,1.587c-35.38,-2.719 -69.644,-8.947 -108.382,-1.587c0,18.105 16.992,32.804 37.922,32.804l82.056,-0c20.93,-0 37.922,-14.699 37.922,-32.804Z" style={{fill:"#ffba00",stroke:"#000",strokeWidth:3}}/>
        </g>
      </svg>);
     }

     const renderNO2 = ()=>{
        return ( <svg  width="100%" height="100%" viewBox="0 0 503 810" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:1.5}}>
         <circle cx="251.5" cy="254.658" r="250" ry="253.158" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
         <path d="M403.664,746.307c0,-6.085 -4.939,-11.025 -11.024,-11.025l-279.968,0c-6.085,0 -11.025,4.94 -11.025,11.025c0,6.084 4.94,11.024 11.025,11.024l279.968,0c6.085,0 11.024,-4.94 11.024,-11.024Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}}/>
         <g ref={no2ref}></g>                
        <g>
        <circle cx="240.833" cy="557.678" r="27.448"  style={{fill:"#ffba00",stroke:"#000",strokeWidth:3}}/>
        <path d="M369.883,503.524l0,18.42c0,14.355 -11.654,26.009 -26.009,26.009l-72.54,0c-2.993,-13.829 -15.764,-24.232 -31.045,-24.232c-15.282,-0 -28.053,10.403 -31.046,24.232l-16.798,0c-7.833,0 -14.193,-6.359 -14.193,-14.193l0,-28.386c0,-7.833 6.36,-14.193 14.193,-14.193l36.215,0l-0,-21.255c-0,-14.354 11.654,-26.009 26.009,-26.009l89.205,0c10.198,0 19.033,5.882 23.295,14.436l-38.377,0c-6.233,0 -11.293,5.06 -11.293,11.293l0,22.585c0,6.233 5.06,11.293 11.293,11.293l41.091,-0Z" style={{fill:"#fff",stroke:"#000",strokeWidth:3}} />
        </g>
     
      </svg>);
     }

    return ( <>
      
        <div style={{width:"100vw", height:"100vh", background:"wheat"}}>
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
            <div style={{height:"200px", display:"flex", alignItems:"center", justifyContent:"center"}} ><div className="largeheading">overall air quality: {airquality}</div></div>
        </div>
    </>)
  
}

export default AirQuality;


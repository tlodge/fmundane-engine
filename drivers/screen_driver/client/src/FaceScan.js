//https://medium.com/codesphere-cloud/creating-a-face-detection-web-app-with-react-and-codesphere-28b1f057145d

import React, { useRef, useEffect, useState, createRef,  } from "react";
import {
  useHistory
} from "react-router-dom";
import "./FaceScan.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
//import Webcam from "react-webcam";
import { drawMesh } from "./meshUtilities.js";
import {useInterval} from './hooks/useInterval';
import {useCamera} from './hooks/useCamera';


const VWIDTH = 1280;//720;//1280;
const VHEIGHT = 960;//500;//960;



function FaceScan({scan="none"}) {

 
  const canvasReference = useRef(null);
  const videoRef = createRef();
  const [video, isCameraInitialised, playing, setPlaying, error] = useCamera(videoRef);
  const [videoopacity, setVideoOpacity] = useState(0);
  const [canvasopacity, setCanvasOpacity] = useState(1);

  //const [video, setVideo] = useState(false);
  const [network, setNetwork] = useState(null);
  const [delay, setDelay] = useState(100);

  useEffect (()=>{
      
      if (video){
        canvasReference.current.width = video.videoWidth;
        canvasReference.current.height = video.videoHeight;
      }

  },[network])

  const detectFace = async (network,video,canvasReference, _scan) => {
  
    try{
      const faceEstimate = await network.estimateFaces(video);
      const ctx = canvasReference.current.getContext("2d");
      ctx.clearRect(0, 0, canvasReference.current.width,canvasReference.current.height );
      drawMesh(faceEstimate, ctx, "white", _scan);
    }catch(err){
      //ignore!
    }
   
  };

  useEffect(()=>{
    if (video){
        facemesh.load({inputResolution: { width: VWIDTH, height: VHEIGHT },scale: 0.8}).then((network)=>{
          setTimeout(()=>{
            console.log("setting network");
            setNetwork(network);
          },1000)
        })
    }
  },[video]);

  useInterval(() => {
  
    detectFace(network,video,canvasReference, scan)
  }, delay);

  const hideMask = ()=>{
    setDelay(null);
    setCanvasOpacity(0);
  }

  const showMask = ()=>{
    setDelay(100);
    setCanvasOpacity(1);
  }
  const showVideo = ()=>{
    setVideoOpacity(1);
  }
  const hideVideo = ()=>{
    setVideoOpacity(0);
  }

  console.log("scan is", scan);

  return (
    <div style={{backgroundColor:"black"}}>
    <div className="App">
      <video
        ref={videoRef}
        style={{
          opacity: videoopacity,
          position:"absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: VWIDTH,
          height: VHEIGHT,
        }}
      />

      <canvas
        ref={canvasReference}
        style={{
          opacity: canvasopacity,
          marginLeft: "auto",
          position:"absolute",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: VWIDTH,
          height: VHEIGHT,
          background:"black",
        }}
      />
      
    </div>
    
    </div>
  );
}
/* <button onClick={()=>{showVideo()}}>show video</button>
    <button onClick={()=>{hideVideo()}}>hide video</button>
    <button onClick={()=>{showMask()}}>show mask</button>
    <button onClick={()=>{hideMask()}}>hide mask</button>*/

export default FaceScan;

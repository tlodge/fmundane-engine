//https://medium.com/codesphere-cloud/creating-a-face-detection-web-app-with-react-and-codesphere-28b1f057145d

import React, { useRef, useEffect, useState, createRef,  } from "react";
import "./FaceScan.css";
import * as tf from "@tensorflow/tfjs";

//import * as facemesh from "@tensorflow-models/facemesh";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh, drawResults } from "./meshUtilities.js";
import {useInterval} from './hooks/useInterval';
import {useCamera} from './hooks/useCamera';
import useWindowDimensions from "./hooks/useWindowDimensions";

//const VWIDTH = 1280;//720;//1280;
//const VHEIGHT = 960;//500;//960;

//https://codesandbox.io/s/stqwv?file=/src/App.js:156-190



function FaceScan() {
  
  const { height:VHEIGHT, width:VWIDTH } = useWindowDimensions();
  const canvasReference = useRef(null);
  const videoRef = useRef(null);
  //const [video, isCameraInitialised, playing, setPlaying, error] = useCamera(videoRef);
  const [videoopacity, setVideoOpacity] = useState(0);
  const [canvasopacity, setCanvasOpacity] = useState(1);

  //const [video, setVideo] = useState(false);
  const [network, setNetwork] = useState(null);
  const [delay, setDelay] = useState(100);

  /*useEffect (()=>{
      
      if (video){
        canvasReference.current.width = 640;// video.videoWidth || VWIDTH ;
        canvasReference.current.height = 480;//video.videoHeight || VHEIGHT;
      }

  },[network])*/

  const detectFace = async (network) => {
  
    try{
      if (
        typeof videoRef.current !== "undefined" &&
        videoRef.current !== null &&
        videoRef.current.video.readyState === 4
      ){
       
        const video = videoRef.current.video;
        //const videoWidth = videoRef.current.video.videoWidth;
        //const videoHeight = videoRef.current.video.videoHeight;

        videoRef.current.video.width = VWIDTH;
        videoRef.current.video.height = VHEIGHT;
        canvasReference.current.width = VWIDTH;
        canvasReference.current.height = VHEIGHT;
        console.log("estimating");
        const faceEstimate = await network.estimateFaces(video);
        console.log(faceEstimate);
        const ctx = canvasReference.current.getContext("2d");
        ctx.clearRect(0, 0, canvasReference.current.width,canvasReference.current.height );
        requestAnimationFrame(()=>{drawResults(faceEstimate, ctx)});
        return true;
      }
    }catch(err){
      //ignore!
      console.log(err);
      return false;
    }
   
  };

  const loadNetwork = async ()=>{
  
    const model = facemesh.SupportedModels.MediaPipeFaceMesh;
    console.log("ok model is", facemesh.SupportedModels.MediaPipeFaceMesh);
   
    //SEE: https://tfhub.dev/mediapipe/tfjs-model/face_landmarks_detection/face_mesh/1
    const detectorConfig = {
      runtime: "tfjs",
      //solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
      detectorModelUrl: "http://localhost:9102/face_detection/short/model.json",
      landmarkModelUrl: "http://localhost:9102/facemesh/model.json",
      maxFaces: 4,
    };

    //"https://tfhub.dev/mediapipe/tfjs-model/face_landmarks_detection/face_mesh/1"
    
    const detector = await facemesh.createDetector(model, detectorConfig);

    console.log("loaded facemesh");
    setInterval(() => {
      detectFace(detector);
    }, 10);
    /*facemesh.load({inputResolution: { width: VWIDTH, height: VHEIGHT },scale: 0.8}).then((network)=>{
      
      setTimeout(()=>{  
        setNetwork(network);
        console.log("network", network);
      },1000)
    })*/

    /*setTimeout(()=>{  
      setNetwork(network);
      console.log("network", network);
    },1000)*/
  }

  useEffect(()=>{
    //if (video){
        loadNetwork();
   // }
  },[]);

  /*useInterval( async () => {
    const result = await detectFace(network,video,canvasReference, scan)
    if (!result){
      setDelay(5000);
      loadNetwork();
    }else{
      setDelay(100);
    }
  }, delay);*/

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


  return (
    <div style={{backgroundColor:"black"}}>
    <div className="App">
      <Webcam
          ref={videoRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
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
          zIndex: 9,
          width: VWIDTH,
          height: VHEIGHT,
          
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

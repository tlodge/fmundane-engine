import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layer from './Layer';
import Navigation from './Navigation';
import Tree from './Tree';
import {
    listenOnEvents,
    listenOnActions,
    listenToSpeech,
    fetchLayers,
    selectEvents,
    selectAuthored,
    selectReadyForInput,
    selectTrees,
    reset,
    fetchAuthored,
} from './experienceSlice';


export function Experience() {
  const events = useSelector(selectEvents);
  const readyforinput = useSelector(selectReadyForInput);
  const trees = useSelector(selectTrees);
  const authored = useSelector(selectAuthored);

  const dispatch = useDispatch();
  const BrowserSpeechRecognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    window.oSpeechRecognition)

  const recognition = BrowserSpeechRecognition ? new BrowserSpeechRecognition() : null;
  recognition.continous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';



  const [startLabel, setStartLabel] = useState("start");
  
  const _fetchLayers = (layer)=>{
    dispatch(fetchLayers(layer, recognition));
  }

  useEffect(() => {
    dispatch(fetchAuthored());
    
    dispatch(listenOnEvents());
   // dispatch(listenToSpeech(recognition));
    dispatch(listenOnActions(window));
    //handleListen();
  }, []); //only re-run the effect if new message comes in

  

  const list = events.map((e,i)=>{
 
  return <div className="flex row mb-4 border-b-2 h-full" key = {e.id}>
           <div className="flex flex-grow justify-center m-4">
           <Layer {...{...e, ready:readyforinput[e.data.id]||false}} /></div>
           <Tree {...{...trees[i], id:e.data.id, triggered:e.triggered}}/>
         </div>      
  });

  //const forest = trees.map((t,i)=><Tree key={i} {...t}/>);

  const resetExperience = ()=>{
     dispatch(reset());
     setStartLabel("reset");
  }
  
  return (
      <div>
        <Navigation authored={authored} fetchLayers={_fetchLayers} start={resetExperience}/>
            {list}
        </div>
  );
  
}

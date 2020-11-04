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
    selectTrees,
    reset,
} from './experienceSlice';


export function Experience() {
  const events = useSelector(selectEvents);
  const trees = useSelector(selectTrees);

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
  useEffect(() => {
    dispatch(fetchLayers());
    dispatch(listenOnEvents());
    dispatch(listenToSpeech(recognition));
    dispatch(listenOnActions(window));
    //handleListen();
  }, []); //only re-run the effect if new message comes in

  console.log('events are', events);
  const list = events.map((e,i)=>{
  console.log("have event",e);
  return <div className="flex row" key = {e.id}>
                                        <div className="w-1/2"><Layer {...e} /></div>
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
        <Navigation start={resetExperience}/>
            {list}
        </div>
  );
  
}

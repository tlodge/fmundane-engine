import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layer from './Layer';

import {
    listenOnEvents,
    listenOnActions,
    listenToSpeech,
    selectLayers,
    reset,
} from './experienceSlice';



export function Experience() {
  const layers = useSelector(selectLayers);
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
    dispatch(listenOnEvents());
    dispatch(listenToSpeech(recognition));
    dispatch(listenOnActions(window));
    //handleListen();
  }, []); //only re-run the effect if new message comes in

  const layerlist = layers.map(e=><Layer key={e.id} {...e} />);
  const resetExperience = ()=>{
     dispatch(reset());
     setStartLabel("reset");
  }
  
  return (
      <div>
        <button onClick={resetExperience} className="bg-blue-500 mr-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{startLabel}</button>
        <div>{layerlist}</div>
        </div>
  );
  
}

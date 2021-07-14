import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layer from './Layer';
import Navigation from './Navigation';
import Tree from './Tree';
import useWindowDimensions from '../../hooks/useWindowDimensions';

import {
    listenOnEvents,
    listenOnActions,
    fetchLayers,
    selectEvents,
    selectAuthored,
    selectReadyForInput,
    selectTrees,
    reset,
    fetchAuthored,
    manualTrigger,
} from './experienceSlice';

export function Experience() {
  const events = useSelector(selectEvents);
  const readyforinput = useSelector(selectReadyForInput);
  const trees = useSelector(selectTrees);
  const authored = useSelector(selectAuthored);

  const [visibleTrees, setVisibleTrees] = useState({});
  const { height, width } = useWindowDimensions();

  console.log("w", width, "h", height);
  const dispatch = useDispatch();
  const BrowserSpeechRecognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    window.oSpeechRecognition)

  const proxyRecognition = ()=>{
    return {
       start : ()=>{}
    }
  }

  const recognition = BrowserSpeechRecognition ? new BrowserSpeechRecognition() : proxyRecognition();
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
    dispatch(listenOnActions(window));
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const {layers=null} = params;
    if (layers){
      dispatch(fetchLayers(layers, recognition))
    }
  }, []); //only re-run the effect if new message comes in

  const toggleTree = (id)=>{
    setVisibleTrees({...visibleTrees, [id]:!(visibleTrees[id]||false)})
  }

  const handleClick = (layer, node)=>{
    console.log("have a handle click!!", layer, node);
    dispatch(manualTrigger(layer,node));
  
  }
  //266+52

  const expandedtrees = Object.keys(visibleTrees).reduce((acc,key)=>{
    if (visibleTrees[key]== true)
      return acc + 1;
    return acc;
  },0)

  const minimised = events.length - expandedtrees;  
  const th = ((height - 54 - (minimised > 0 ? 280 :0)) / expandedtrees) - events.length*4;

  const list = events.sort((e1, e2)=>{
      if (visibleTrees[e1.id] && !visibleTrees[e2.id])
        return -1;
      if (visibleTrees[e2.id] && !visibleTrees[e1.id])
        return 1;
      return 0;

  }).map((e,i)=>{
 
  return  <div key = {e.id} className="flex flex-row m-1">
            <div  className="flex w-64 justify-center">
              <Layer {...{...e, ready:readyforinput[e.data.id]||false, toggleTree}} />
            </div>
           { visibleTrees[e.id]  && <Tree {...{...trees[i], handleClick:(node)=>{handleClick(e.id, node)}, height:th, id:e.data.id, triggered:e.triggered}}/>}
         </div>  
  });

  //const forest = trees.map((t,i)=><Tree key={i} {...t}/>);

  const resetExperience = ()=>{
     dispatch(reset());
     setStartLabel("reset");
  }
  
  console.log(visibleTrees);
  return (
      <div>
        <Navigation authored={authored} fetchLayers={_fetchLayers} start={resetExperience}/>
        <div className="flex row mb-4 border-b-2 flex-wrap" >
        {list}
        </div>
      </div>
  );
  
}

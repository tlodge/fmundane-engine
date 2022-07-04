import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layer from './Layer';
import Navigation from './Navigation';
import Tree from './Tree';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { Importer } from './Importer';
import request from 'superagent';
import superagent from 'superagent';

import {
    listenOnEvents,
    listenOnActions,
    fetchLayers,
    selectEvents,
    selectAuthored,
    selectReadyForInput,
    selectLayerName,
    selectRendering,
    selectTrees,
    reset,
    fetchAuthored,
    manualTrigger,
    renderSpeech,
} from './experienceSlice';

export function Experience() {
  const events = useSelector(selectEvents);
  const readyforinput = useSelector(selectReadyForInput);
  const trees = useSelector(selectTrees);
  const authored = useSelector(selectAuthored);
  const layerName = useSelector(selectLayerName);
  const rendering = useSelector(selectRendering);
  const [visibleTrees, setVisibleTrees] = useState({});
  const [create, setCreate] = useState(false);

  const { height } = useWindowDimensions();

  const dispatch = useDispatch();


  const proxyRecognition = ()=>{
    return {
       start : ()=>{}
    }
  }

  
  const toggleCreate = (value)=>{
    if (value != undefined){
      setCreate(value);
    }else{
      setCreate(!create);
    }
  }


  const [startLabel, setStartLabel] = useState("start");
  
  //const _fetchLayers = (layer)=>{
  //  dispatch(fetchLayers(layer, recognition));
 //}

  useEffect(() => {
    const BrowserSpeechRecognition =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition ||
      window.oSpeechRecognition)
    const recognition = BrowserSpeechRecognition ? new BrowserSpeechRecognition() : proxyRecognition();
    recognition.continous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

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
    dispatch(manualTrigger(layer,node));
  }
 

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
              <div  className="flex w-64 justify-center overflow-visible" style={{height:visibleTrees[e.id] ? th-2: 280}}>
                <Layer {...{...e, ready:readyforinput[e.id]||false, toggleTree}} />
              </div>
            { visibleTrees[e.id]  && <Tree {...{...trees[e.id], handleClick:(node)=>{handleClick(e.id, node)}, height:th, id:e.data.id, triggered:e.triggered}}/>}
          </div>  
  });

  //const forest = trees.map((t,i)=><Tree key={i} {...t}/>);

  const resetExperience = ()=>{
     dispatch(reset());
     setStartLabel("reset");
  }
  const save = async (name, json)=>{
    await request.post('/author/save').set('Content-Type', 'application/json').send({name,layer:json});
    toggleCreate(false);
  }

  const exportTwine = ()=>{
    superagent.get('/author/translate').query({name:layerName}).then(res => {
      const {html} = res.body;
      const htmlString = `data:text/html;chatset=utf-8,${encodeURIComponent(html)}`;
      const link = document.createElement("a");
      link.href = htmlString;
      link.download = `${layerName}.html`;
      link.click();
   })
  }

  const _renderSpeech = ()=>{
    dispatch(renderSpeech());
  }

  return (
      <div>
        <Navigation rendering={rendering} authored={authored} start={resetExperience} toggleCreate={toggleCreate} twineExport={exportTwine} renderSpeech={_renderSpeech}/>
        <div className="flex row mb-4 border-b-2 flex-wrap" >
        {list}
       
        </div>
       
        {create && <Importer save={(name,json)=>save(name,json)} cancel={()=>toggleCreate(false)}/>}
      </div>
  );
  
}

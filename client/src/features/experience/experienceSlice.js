import { compose, createSlice } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import superagent from 'superagent';
import * as d3 from 'd3-hierarchy';

//import Layer from './Layer';

const socket = io(window.location.href);


export const experienceSlice = createSlice({
  name: 'experience',
  
  initialState: {
    layers: [],
    events: [],
    readyforinput: {},
    transcript: "",
    lastsenttranscript:"",
    authored:[],
    layerName:"",
    listening: {},
    rendering:false,
  },

  reducers: {
    setAuthored : (state, action)=>{
      state.authored = action.payload;
    },
    setLayerName : (state, action)=>{
      state.layerName = action.payload;
    },
    setLayers : (state, action)=>{
      state.layers = action.payload;
    },
    setEvents: (state, action)=>{
      state.events = action.payload;
    },
    setEvent: (state, action) => {
      state.events = [...state.events.filter(l=>l.id !== action.payload.id), action.payload];
    },
    setTranscript: (state, action)=>{
      const {transcript, layerid} = action.payload;
      state.transcript = transcript;
    },
    setReadyForInput: (state,action)=>{
      state.readyforinput = {
        ...state.readyforinput, ...action.payload
      }
    },
    setListening: (state, action)=>{
      const {layerid, listening} = action.payload;
      state.listening = {
        ...state.listening,
        [layerid] : listening
      }
    },
    sentTranscript: (state)=>{
      state.lastsenttranscript = state.transcript;
    },
    resetReadiness: (state)=>{
      state.readyforinput = {};
    },
    setRendering: (state,action)=>{
      state.rendering = action.payload;
    }
  }
});

export const { setRendering, setLayers, setLayerName, setEvent, setListening, setEvents, setTranscript,sentTranscript,setReadyForInput,setAuthored,resetReadiness} = experienceSlice.actions;

export const reset = (layerid="")=>dispatch=>{
  superagent.get('/event/start').then(res => {
    dispatch(resetReadiness());
    dispatch(setEvents(res.body));
    dispatch(setTranscript({transcript:"", layerid}));
  
 })
 .catch(err => {
   console.log("error resetting events", err);
    // err.message, err.response
 });
}

const delay = (ms) =>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve()
    }, ms);
  });
}


//TODO - get rid - this is to react to browser speech synth, which not using now

export const listenOnActions = (window) => async dispatch => {
  //const voices = await getVoices();

  socket.on('action', async actions => {

  
  for (const payload of actions){
  
  
    /*if (payload.type==="browserspeech"){
      for (const sentence of payload.data.speech){
        _talking = true;
       // recognition.stop();
        await sayWords(window, sentence.words,voices[1]);//51
        if (sentence.delay){
          await delay(sentence.delay);
        }
      }
     _talking = false;
     try{
     
      //recognition.start();
    }catch(err){
     
    }
      //window.speechSynthesis.speak(new SpeechSynthesisUtterance(payload.data.words));
    }
   */
  }
 });
}

export const renderSpeech = ()=> async (dispatch, getState)=>{
  const name = getState().experience.layerName;
  dispatch(setRendering(true));
  await superagent.get("/author/render").query({name});
  dispatch(setRendering(false));
}

export const listenOnEvents = () => (dispatch, getState) => {


  socket.on('event', payload => {
    dispatch(setTranscript({transcript:""}));
    dispatch(setListening({layerid: payload.id, listening:false}));
    dispatch(setEvent(payload));
  });

  socket.on('ready', payload=>{
    //TODO: get layerid from event!
    const {event, layer} = payload;
   
    dispatch(setTranscript({transcript:""}));
    console.log("setting ready for inout", event, layer);
    dispatch(setReadyForInput({[layer]:true}));

    if (event.type==="speech"){
      dispatch(setListening({layerid: layer, listening:true}));
    }
  });
}

socket.on("connect_error", () => {
  const reconnect = ()=>{
    console.log("attempting to reconnect!!");
    setTimeout(() => {
      socket.connect();
    }, 1000);
  }
  reconnect();
});

export const buttonPressed  = (b, layerid) => (dispatch)=>{
  console.log("button pressed!!", b, layerid);
  dispatch(setReadyForInput({[layerid]:false}));
  superagent.get("/event/press").query({name:b, layer:layerid}).end((err, res) => {
    if (err){
        console.log(err);
    }   
  });
}

export const manualWebhook  = (b, layerid) => ()=>{
  superagent.get("/event/webhook").query({trigger:b}).end((err, res) => {
    if (err){
        console.log(err);
    }   
  });
}

export const manualTrigger = (layer, node)=>()=>{
  superagent.get("/event/trigger").query({layer,node}).end((err, res) => {
    if (err){
        console.log(err);
    }   
  });
}

//TOD0 - only listen if any of the current events are listening events.
//on server only subscibe to current events rather than all!!

export const sendTranscript = () => (dispatch, getState) =>{
   
    const {transcript} = getState().experience;
    const layers = getState().experience.listening

    const sendTranscript = async ()=>{
      for (const key of Object.keys(layers)){
        if (layers[key]){    
          await superagent.get("/event/speech").query({layer:key, speech:getState().experience.transcript})
          dispatch(sentTranscript());      
        }
      }
      dispatch(setTranscript({transcript:""}));
    }
    
    if (transcript.trim() !== ""){
      sendTranscript();
    }
};

export const gestureObserved = (g,layerid)=> (dispatch, getState) =>{
  //stopListening();
  superagent.get("/event/gesture").query({gesture:g}).end((err, res)=>{});
  //dispatch(setEvent({}));
}

export const fetchAuthored = ()=>(dispatch)=>{
  superagent.get('/author/authored').then(res => {
    const alist = res.body.layers;
    dispatch(setAuthored(alist));
  })
}



//this kicks everything off;

//recogniotion cannot know about layer!!

export const fetchLayers = (layer, r) => (dispatch, getState)=>{
  
  superagent.get('/event/layers').query({layer}).then(res => {
    const trees = res.body.map(et=>({...et.tree, layerid:et.layerid}));
    dispatch(setLayerName(layer));
    dispatch(setLayers(trees));
  })
  .catch(err => {
    console.log("error resetting events", err);
  });
}


export const listenToSpeech = () => (dispatch, getState) => {
  //console.log("called listen to speech!");
  //startRecognition();
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectEvents= state => {
  return  [...(state.experience.events || [])].sort((a,b)=>{
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return -1;
  });
}


export const selectReadyForInput = state => state.experience.readyforinput;
export const selectSpeech= state => state.experience.transcript;


export const selectTrees = state =>  {
    return state.experience.layers.reduce((acc, item)=>{
      return {
          ...acc,
          [item.layerid] : d3.tree().nodeSize([120, 230])(d3.hierarchy(item, d=>d.children))
      }
    },{});
}
export const selectAuthored = state => state.experience.authored;
export const selectLayerName = state => state.experience.layerName;
export const selectRendering = state => state.experience.rendering;

export default experienceSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import superagent from 'superagent';
import * as d3 from 'd3-hierarchy';

//import Layer from './Layer';

const socket = io(window.location.href);
let recognition;
let _canlisten = false;


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
      state.transcript = action.payload;
    },
    setReadyForInput: (state,action)=>{
      state.readyforinput = {
        ...state.readyforinput, [action.payload]:true
      }
    },
    sentTranscript: (state)=>{
      state.lastsenttranscript = state.transcript;
    },
    resetReadiness: (state)=>{
     // state.readyforinput = {};
    }
  }
});

export const { setLayers, setLayerName, setEvent, setEvents, setTranscript,sentTranscript,setReadyForInput,setAuthored,resetReadiness} = experienceSlice.actions;

export const reset = ()=>dispatch=>{
  superagent.get('/event/start').then(res => {
    dispatch(setEvents(res.body));
    dispatch(setTranscript(""));
    dispatch(resetReadiness());
 })
 .catch(err => {
   console.log("error resetting events", err);
    // err.message, err.response
 });
}

const stopListening = ()=>{
  _canlisten = false;
}

const allowListening = ()=>{
  _canlisten = true;
}

const allowedToListen = ()=>{
  return _canlisten;
}

const delay = (ms) =>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve()
    }, ms);
  });
}

/*const getVoices = () => {
  return new Promise(resolve => {
    let voices = speechSynthesis.getVoices()
    if (voices.length) {
      resolve(voices)
      return
    }
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices()
      resolve(voices)
    }
  })
}

const sayWords = async (window, words, voice)=>{
  var msg = new SpeechSynthesisUtterance();
 

  msg.text = words;
  msg.voice = voice;
  try{ 
     window.speechSynthesis.speak(msg);
  }catch(err){
    console.log(err);
  }
  
  return new Promise(resolve => {
    msg.onend = resolve;
  });
}*/


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

export const listenOnEvents = () => (dispatch, getState) => {


  socket.on('event', payload => {
    console.log("seen event", payload);
    //here it is!!
    dispatch(setTranscript(""));
    console.log("now transcript is", getState().experience.transcript);
    dispatch(setEvent(payload));
  });

  socket.on('ready', payload=>{
  
    const {event} = payload; 
    console.log("SEEN A READY!!", event);
    dispatch(setTranscript(""));
    console.log("now transcript is", getState().experience.transcript);
    dispatch(setReadyForInput(event.id));

    if (event.type==="speech"){
     
      allowListening();
      startRecognition();
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

export const buttonPressed  = (b) => ()=>{
  stopListening();
  superagent.get("/event/press").query({name:b}).end((err, res) => {
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
    
    if (transcript.trim() != ""){
      console.log("in send transcript", transcript);
      superagent.get("/event/speech").query({speech:getState().experience.transcript}).end((err, res)=>{
        //stopListening(); //need to get an event back....
        if (!err){
          dispatch(sentTranscript());
          dispatch(setTranscript(""));
        }
      });
      //dispatch(setEvent({}));
    }
   
};

export const gestureObserved = (g)=> (dispatch, getState) =>{
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

export const fetchLayers = (layer, r) => (dispatch, getState)=>{
  
  recognition = r;

  superagent.get('/event/layers').query({layer}).then(res => {
    const trees = res.body.map(et=>({...et.tree, layerid:et.layerid}));
    dispatch(setLayerName(layer));
    dispatch(setLayers(trees));
  })
  .catch(err => {
    console.log("error resetting events", err);
  });
  
  recognition.onend = () => {
    
    if (allowedToListen()){
       startRecognition();
    }else{
     
    }
  }

  recognition.onresult = event => {    
   
    //TODO: why is transcript sending here (post event?)

    for (let i = event.resultIndex; i < event.results.length; i++) {
      
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal){ 
        if (transcript.trim() != ""){
          //dispatch(recordState(getState().experience.));
          console.log("setting/sending transcript", (transcript + ' '));
          dispatch(setTranscript(transcript + ' '));
          dispatch(sendTranscript());
        }
      }
    }
    //if (allowedToListen()){
    
      

    //}
  }
}


const startRecognition = ()=>{
  
  try{  
    recognition.start();
  }catch(err){
    //console.log(err);
  }
}

export const listenToSpeech = () => (dispatch, getState) => {
  startRecognition();
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

export default experienceSlice.reducer;

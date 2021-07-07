import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import superagent from 'superagent';
import * as d3 from 'd3-hierarchy';

//import Layer from './Layer';

const socket = io('http://localhost:3001');
let recognition, voice;
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
  },

  reducers: {
    setAuthored : (state, action)=>{
      state.authored = action.payload
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

export const { setLayers, setEvent, setEvents, setTranscript,sentTranscript,setReadyForInput,setAuthored,resetReadiness} = experienceSlice.actions;

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
  console.log("************** stopping listening!!");
  _canlisten = false;
}

const allowListening = ()=>{
  console.log("************* allowing listening!!");
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

export const listenOnActions = (window) => async dispatch => {
  //const voices = await getVoices();

  socket.on('action', async actions => {

  
  for (const payload of actions){
  
    console.log("seen an action", payload);
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

    console.log("-------------------->  seen event", payload);
    //stopListening();
    dispatch(setEvent(payload));

    console.log("EVENTS ARE NOW", getState().experience.events);
  });

  socket.on('ready', payload=>{
  
    const {event} = payload; 

    console.log("----------> SEEN A READY!!!", event.id);

    dispatch(setReadyForInput(event.id));
    console.log("GREAT NOW RFI IS", getState().experience.readyforinput)

    //stopListening();

    if (event.type==="speech"){
      console.log("starting speech recognition!!");
      //dispatch(listenToSpeech());
      allowListening();
      startRecognition();
    }
  });
}

export const buttonPressed  = (b) => (dispatch)=>{
  stopListening();
  superagent.get("/event/press").query({name:b}).end((err, res) => {
    if (err){
        console.log(err);
    }   
  });
}

//TOD0 - only listen if any of the current events are listening events.
//on server only subscibe to current events rather than all!!

export const sendTranscript = () => (dispatch, getState) =>{
   
    const {transcript, lastsenttranscript} = getState().experience;
    
    if (lastsenttranscript.trim() != transcript.trim() && transcript.trim() != ""){
      superagent.get("/event/speech").query({speech:getState().experience.transcript}).end((err, res)=>{
        //stopListening(); //need to get an event back....
        if (!err){
          dispatch(sentTranscript())
        }
      });
      //dispatch(setEvent({}));
    }
   
};

export const gestureObserved = (g)=> (dispatch, getState) =>{
  stopListening();
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

export const fetchLayers = (layer, r) => (dispatch)=>{
  
  recognition = r;

  superagent.get('/event/layers').query({layer}).then(res => {
    const trees = res.body.map(et=>et.tree);
    dispatch(setLayers(trees));
  })
  .catch(err => {
    console.log("error resetting events", err);
  });
  
  recognition.onend = () => {
   

    dispatch(setTranscript(""));
    if (allowedToListen()){
       startRecognition();
    }else{
      console.log("recognition ended");
    }
  }

  recognition.onresult = event => {    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal){ 
        if (transcript.trim() != ""){
          dispatch(setTranscript(transcript + ' '));
        }
      }
    }
    if (allowedToListen()){
      dispatch(sendTranscript());
    }
  }
}


const startRecognition = ()=>{
  
  try{  
    console.log("starting recognition")   
    recognition.start();
  }catch(err){
    
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

const separation = (a, b) =>{
  return (a.parent == b.parent ? 1 : 2)
}

export const selectReadyForInput = state => state.experience.readyforinput;
export const selectSpeech= state => state.experience.transcript;

export const selectTrees = state =>  state.experience.layers.map(t=>d3.tree().nodeSize([120, 230])(d3.hierarchy(t, d=>d.children)))

export const selectAuthored = state => state.experience.authored;

export default experienceSlice.reducer;

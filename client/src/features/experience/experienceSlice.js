import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import superagent from 'superagent';
import * as d3 from 'd3-hierarchy';

//import Layer from './Layer';

const socket = io('http://localhost:3001');
let recognition, voice;
let _talking = false;

export const experienceSlice = createSlice({
  name: 'experience',
  
  initialState: {
    layers: [],
    events: [],
    readyforinput: {},
    transcript: "",
    lastsenttranscript:"",
   
  },

  reducers: {
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
      state.readyforinput = {[action.payload]:true}
    },
    sentTranscript: (state)=>{
      state.lastsenttranscript = state.transcript;
    }
  }
});

export const { setLayers, setEvent, setEvents, setTranscript,sentTranscript,setReadyForInput } = experienceSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched

export const reset = ()=>dispatch=>{
  superagent.get('/event/start').then(res => {
    dispatch(setEvents(res.body));
    dispatch(setTranscript(""));
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

const getVoices = () => {
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
}

export const listenOnActions = (window) => async dispatch => {
  const voices = await getVoices();

  socket.on('action', async actions => {
  
  for (const payload of actions){
  
   
    if (payload.type==="browserspeech"){
      for (const sentence of payload.data.speech){
        _talking = true;
        recognition.stop();
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
   
  }
  

 });
}

export const listenOnEvents = () => dispatch => {
  socket.on('event', payload => {
   
    dispatch(setEvent(payload));
  });

  socket.on('ready', payload=>{
    const {event} = payload; 
    dispatch(setReadyForInput(event))
    _talking = false;
    startRecognition();
  });
}

export const sendTranscript = () => (dispatch, getState) =>{
  _talking = true;
    const {transcript, lastsenttranscript} = getState().experience;
    
    if (lastsenttranscript.trim() != transcript.trim()){
      
      superagent.get("/event/speech").query({speech:getState().experience.transcript}).end((err, res)=>{
        if (!err){
          dispatch(sentTranscript())
        }
      });
      console.log("sending spepck observerd", getState().experience.transcript);
      //dispatch(setEvent({}));
    }
};

export const gestureObserved = (g)=> (dispatch, getState) =>{
  _talking = true;
  superagent.get("/event/gesture").query({gesture:g}).end((err, res)=>{});
  console.log("sending gesture observerd", g);
  //dispatch(setEvent({}));
}


export const fetchLayers = () => (dispatch)=>{

  superagent.get('/event/layers').then(res => {
   
    const trees = res.body.map(et=>et.tree);
      
    dispatch(setLayers(trees));
  })
  .catch(err => {
    console.log("error resetting events", err);
    // err.message, err.response
  });
}


const startRecognition = ()=>{
  try{     
    //recognition.start();
  }catch(err){
    
  }
}

export const listenToSpeech = (r) => (dispatch, getState) => {
  
  recognition = r;

  recognition.onend = () => {
    //dispatch(setTranscript(""));
    if (!_talking){
      startRecognition();
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
    dispatch(sendTranscript());
  }

  startRecognition();
  //recognition.start();
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

export default experienceSlice.reducer;
